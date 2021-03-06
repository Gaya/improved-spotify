import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { SPOTIFY_PLAYLIST_TRACKS } from '../../../consts';
import { getPlaylistTracks } from '../../../utils/externalData';
import extractTrackData from '../../../utils/extractTrackData';
import { info } from '../../../utils/logging';
import DatabaseContext from '../../../database/context';
import {
  queryPlaylistTracks,
  removePlaylistTracksByPlaylist,
  storePlaylistTracks,
} from '../../../database/queries';
import {
  currentPlaylistTracks,
  playlistSearchFilter,
  playlistSelectedArtist,
  playlistTracksState,
} from '../../../state/atoms';
import { TrackState } from '../../../enums';

interface UseTrackListState {
  isResolving: boolean;
  isResolved: boolean;
  needsFetching: boolean;
  showProgress: boolean;
  totalTracks: number;
  fetchedTracks: SpotifyPlaylistTrack[];
  tracks: StoredSpotifyPlaylistTrack[];
}

const defaultState: UseTrackListState = {
  isResolving: false,
  isResolved: false,
  needsFetching: false,
  showProgress: false,
  totalTracks: 0,
  fetchedTracks: [],
  tracks: [],
};

interface FinishTrackData {
  type: 'FINISH_TRACK_DATA';
  payload: StoredSpotifyPlaylistTrack[];
}

interface UpdateTrackData {
  type: 'UPDATE_TRACK_DATA';
  payload: StoredSpotifyPlaylistTrack[];
}

interface StartFetching {
  type: 'START_FETCHING';
}

interface ContinueFetching {
  type: 'CONTINUE_FETCHING';
}

interface StartResolving {
  type: 'START_RESOLVING';
}

interface ReceiveTracks {
  type: 'RECEIVE_TRACKS';
  payload: PagedResponse<SpotifyPlaylistTrack>;
}

interface Reset {
  type: 'RESET';
}

type UseTrackListAction = UpdateTrackData | StartFetching | StartResolving | ReceiveTracks
  | ContinueFetching | FinishTrackData | Reset;

function reducer(state: UseTrackListState, action: UseTrackListAction): UseTrackListState {
  switch (action.type) {
    case 'RECEIVE_TRACKS':
      return {
        ...state,
        totalTracks: action.payload.total,
        fetchedTracks: [...state.fetchedTracks, ...action.payload.items],
        needsFetching: !!action.payload.next,
      };
    case 'START_RESOLVING':
      return {
        ...state,
        isResolving: true,
      };
    case 'START_FETCHING':
      return {
        ...state,
        needsFetching: true,
        showProgress: true,
      };
    case 'CONTINUE_FETCHING':
      return {
        ...state,
        needsFetching: false,
      };
    case 'UPDATE_TRACK_DATA':
      return {
        ...state,
        tracks: [...state.tracks, ...action.payload],
      };
    case 'FINISH_TRACK_DATA':
      return {
        ...state,
        tracks: [...state.tracks, ...action.payload],
        isResolved: true,
        isResolving: false,
        needsFetching: false,
        fetchedTracks: [],
      };
    case 'RESET':
      return defaultState;
    default:
      return state;
  }
}

function useTrackList(id: string): {
  progress: number;
  isResolved: boolean;
  showProgress: boolean;
} {
  const db = useContext(DatabaseContext);
  const [tracksState, setTracksState] = useRecoilState(playlistTracksState);
  const setCurrentTracksState = useSetRecoilState(currentPlaylistTracks);
  const setSelectedArtist = useSetRecoilState(playlistSelectedArtist);
  const setFilter = useSetRecoilState(playlistSearchFilter);

  const [state, dispatch] = useReducer(reducer, defaultState);

  const {
    isResolved,
    isResolving,
    needsFetching,
    showProgress,
    totalTracks,
    fetchedTracks,
    tracks,
  } = state;

  const nextRef = useRef<string | undefined>();

  useEffect(() => {
    info(`Switching to playlist ${id}`);

    // reset recoil atoms
    setCurrentTracksState([]);
    setSelectedArtist(undefined);
    setFilter('');

    // reset hook state
    nextRef.current = SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id);
    dispatch({ type: 'RESET' });
  }, [id, setCurrentTracksState, setFilter, setSelectedArtist]);

  useEffect(() => {
    if (isResolved && tracks) {
      info('Updating tracks in recoil state');
      setCurrentTracksState([...tracks]);
    }
  }, [isResolved, setCurrentTracksState, tracks]);

  const onFinishTrackData = useCallback((playlistTracks: StoredSpotifyPlaylistTrack[]): void => {
    dispatch({
      type: 'FINISH_TRACK_DATA',
      payload: playlistTracks,
    });
  }, []);

  // store tracks in database
  const storeTrackData = useCallback((
    playlistTracks: StoredSpotifyPlaylistTrack[],
    end = false,
  ): void => {
    if (db) {
      info('Save received data to database');
      storePlaylistTracks(db, playlistTracks)
        .then(() => {
          if (end) {
            setTracksState({
              ...tracksState,
              [id]: TrackState.VALID,
            });

            onFinishTrackData(playlistTracks);
          } else {
            dispatch({
              type: 'UPDATE_TRACK_DATA',
              payload: playlistTracks,
            });
          }
        });
    }
  }, [db, id, onFinishTrackData, setTracksState, tracksState]);

  // fetching mechanism
  useEffect(() => {
    if (isResolving && needsFetching && !isResolved && nextRef.current) {
      dispatch({ type: 'CONTINUE_FETCHING' });

      info(`Fetching ${nextRef.current}`);

      getPlaylistTracks(nextRef.current).then((response) => {
        if (response.next) {
          nextRef.current = response.next;
        }

        dispatch({
          type: 'RECEIVE_TRACKS',
          payload: response,
        });

        const extracted = extractTrackData(id, response.items, response.offset);
        storeTrackData(extracted, !response.next);
      });
    }
  }, [id, isResolved, isResolving, needsFetching, storeTrackData]);

  // find tracks in cache or start fetching
  useEffect(() => {
    if (!needsFetching && db && tracksState[id] && !isResolving && !isResolved) {
      dispatch({ type: 'START_RESOLVING' });

      ((): Promise<void> => {
        if (tracksState[id] === TrackState.INVALID) {
          // remove tracks from db
          info('Snapshot out of date, removing cached tracks');
          return removePlaylistTracksByPlaylist(db, id);
        }

        return Promise.resolve(undefined);
      })()
        .then(() => queryPlaylistTracks(db, id))
        .then((result) => {
          if (result.length > 0 && tracksState[id] === TrackState.VALID) {
            // has result... so resolve it!
            info('Using cached data from database');

            onFinishTrackData(result);
          } else {
            // no results? Start fetching process
            dispatch({ type: 'START_FETCHING' });
          }
        });
    }
  }, [db, id, isResolved, isResolving, needsFetching, onFinishTrackData, tracksState]);

  return {
    progress: isResolved ? 100 : ((fetchedTracks.length / totalTracks) || 0) * 100,
    isResolved,
    showProgress,
  };
}

export default useTrackList;
