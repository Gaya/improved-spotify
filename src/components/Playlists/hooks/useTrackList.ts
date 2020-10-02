import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { useRecoilState } from 'recoil';

import {
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

function useTrackList(id: string): {
  progress: number;
  tracks: StoredSpotifyPlaylistTrack[];
  isResolved: boolean;
} {
  const db = useContext(DatabaseContext);
  const [tracksState, setTracksState] = useRecoilState(playlistTracksState);

  const [isResolving, setIsResolving] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [totalTracks, setTotalTracks] = useState(0);
  const [fetchedTracks, setFetchedTracks] = useState<SpotifyPlaylistTrack[]>([]);
  const [tracks, setTracks] = useState<StoredSpotifyPlaylistTrack[]>([]);
  const nextRef = useRef(SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id));

  // update tracks in state
  const updateTrackData = useCallback((playlistTracks: StoredSpotifyPlaylistTrack[]) => {
    setTracks(playlistTracks);
    setIsResolved(true);
  }, []);

  // store tracks in database
  const storeTrackData = useCallback((data: SpotifyDataExport): void => {
    if (db) {
      info('Update cached data');
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
    if (isResolving && isFetching && !isResolved) {
      setIsFetching(false);

      // no result... let's fetch them from Spotify
      info(`Fetching ${nextRef.current}`);

      getPlaylistTracks(nextRef.current).then((response) => {
        const allTracks = [...fetchedTracks, ...response.items];

        if (totalTracks !== response.total) {
          setTotalTracks(response.total);
        }

        setFetchedTracks(allTracks);

        if (response.next) {
          nextRef.current = response.next;
          setIsFetching(true);
        } else {
          const extracted = extractTrackData(id, allTracks);
          storeTrackData(extracted, true);
        }
      });
    }
  }, [fetchedTracks, id, isFetching, isResolved, isResolving, storeTrackData, totalTracks]);

  // find tracks in cache or start fetching
  useEffect(() => {
    if (!isFetching && db && tracksState[id] && !isResolving && !isResolved) {
      setIsResolving(true);

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
          if (result.length > 0 && TrackState.VALID) {
            // has result... so resolve it!
            updateTrackData(result);
          } else {
            // no results? Start fetching process
            setIsFetching(true);
          }
        });
    }
  }, [db, id, isFetching, isResolved, isResolving, tracksState, updateTrackData]);

  return {
    tracks,
    progress: isResolved ? 100 : ((fetchedTracks.length / totalTracks) || 0) * 100,
    isResolved,
  };
}

export default useTrackList;
