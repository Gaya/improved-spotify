import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { useRecoilState } from 'recoil';

import {
  PagedResponse,
  SpotifyDataExport, SpotifyPlaylistTrack, StoredSpotifyPlaylistTrack, TrackState,
} from '../../../types';
import { SPOTIFY_PLAYLIST_TRACKS } from '../../../consts';
import { getPlaylistTracks } from '../../../utils/externalData';
import extractTrackData from '../../../utils/extractTrackData';
import { info } from '../../../utils/logging';
import DatabaseContext from '../../../database/context';
import {
  queryPlaylistTracks,
  removePlaylistTracksByPlaylist,
  storeDataExport,
} from '../../../database/queries';
import { playlistTracksState } from '../../../state/atoms';

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

type UseTrackListAction = UpdateTrackData | StartFetching | StartResolving | ReceiveTracks
  | ContinueFetching;

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
        tracks: action.payload,
        isResolved: true,
        isResolving: false,
        needsFetching: false,
        fetchedTracks: [],
      };
    default:
      return state;
  }
}

function useTrackList(id: string): {
  progress: number;
  tracks: StoredSpotifyPlaylistTrack[];
  isResolved: boolean;
  showProgress: boolean;
} {
  const db = useContext(DatabaseContext);
  const [tracksState, setTracksState] = useRecoilState(playlistTracksState);

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

  const nextRef = useRef(SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id));

  // update tracks in state
  const updateTrackData = useCallback((playlistTracks: StoredSpotifyPlaylistTrack[]) => {
    dispatch({
      type: 'UPDATE_TRACK_DATA',
      payload: playlistTracks,
    });
  }, []);

  // store tracks in database
  const storeTrackData = useCallback((data: SpotifyDataExport): void => {
    if (db) {
      info('Save cached data to database');
      storeDataExport(db, data)
        .then(() => {
          setTracksState({
            ...tracksState,
            [id]: TrackState.VALID,
          });
          updateTrackData(data.playlistTracks);
        });
    }
  }, [db, id, setTracksState, tracksState, updateTrackData]);

  // fetching mechanism
  useEffect(() => {
    if (isResolving && needsFetching && !isResolved) {
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

        if (!response.next) {
          const allTracks = [...fetchedTracks, ...response.items];
          const extracted = extractTrackData(id, allTracks);
          storeTrackData(extracted);
        }
      });
    }
  }, [fetchedTracks, id, isResolved, isResolving, needsFetching, storeTrackData]);

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
            updateTrackData(result);
          } else {
            // no results? Start fetching process
            dispatch({ type: 'START_FETCHING' });
          }
        });
    }
  }, [db, id, isResolved, isResolving, needsFetching, tracksState, updateTrackData]);

  return {
    tracks,
    progress: isResolved ? 100 : ((fetchedTracks.length / totalTracks) || 0) * 100,
    isResolved,
    showProgress,
  };
}

export default useTrackList;
