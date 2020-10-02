import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { SpotifyDataExport, SpotifyPlaylistTrack, StoredSpotifyPlaylistTrack } from '../../../types';
import { SPOTIFY_PLAYLIST_TRACKS } from '../../../consts';
import { getPlaylistTracks } from '../../../utils/externalData';
import extractTrackData from '../../../utils/extractTrackData';
import { info } from '../../../utils/logging';
import DatabaseContext from '../../../database/context';
import { storeDataExport } from '../../../database/queries';

function useTrackList(id: string): {
  progress: number;
  tracks: StoredSpotifyPlaylistTrack[];
} {
  const db = useContext(DatabaseContext);

  const hasTracks = false;

  const [isFetching, setIsFetching] = useState(false);
  const [totalTracks, setTotalTracks] = useState(0);
  const [fetchedTracks, setFetchedTracks] = useState<SpotifyPlaylistTrack[]>([]);
  const nextRef = useRef(SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id));

  const updateTrackData = useCallback((data: SpotifyDataExport): void => {
    if (db) {
      info('Update cached data');
      storeDataExport(db, data);
    }
  }, [db]);

  useEffect(() => {
    if (!isFetching && !hasTracks) {
      setIsFetching(true);

      info(`Fetching ${nextRef.current}`);

      getPlaylistTracks(nextRef.current).then((response) => {
        const allTracks = [...fetchedTracks, ...response.items];

        if (totalTracks !== response.total) {
          setTotalTracks(response.total);
        }

        setFetchedTracks(allTracks);

        if (response.next) {
          nextRef.current = response.next;
          setIsFetching(false);
        } else {
          const extracted = extractTrackData(id, allTracks);
          updateTrackData(extracted);
        }
      });
    }
  }, [fetchedTracks, hasTracks, id, isFetching, totalTracks, updateTrackData]);

  return {
    tracks: [],
    progress: hasTracks ? 100 : ((fetchedTracks.length / totalTracks) || 0) * 100,
  };
}

export default useTrackList;
