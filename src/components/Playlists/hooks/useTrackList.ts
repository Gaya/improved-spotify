import { useEffect, useRef, useState } from 'react';

import { PagedResponse, SpotifyTrack } from '../../../types';
import { SPOTIFY_PLAYLIST_TRACKS } from '../../../consts';
import { get } from '../../../utils/authRequest';

function useTrackList(id: string): {
  totalTracks: number;
  progress: number;
  tracks: SpotifyTrack[];
} {
  const [isFetching, setIsFetching] = useState(false);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const nextRef = useRef(SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id));

  useEffect(() => {
    if (!isFetching) {
      setIsFetching(true);

      get<PagedResponse<SpotifyTrack>>(nextRef.current).then((response) => {
        setTracks([...tracks, ...response.items]);
        setTotalTracks(response.total);

        if (response.next) {
          nextRef.current = response.next;
          setIsFetching(false);
        }
      });
    }
  }, [id, isFetching, tracks]);

  return {
    tracks,
    progress: (tracks.length / totalTracks) * 100,
    totalTracks,
  };
}

export default useTrackList;
