import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';

import { SpotifyDataExport, SpotifyTrack, StoredSpotifyTrack } from '../../../types';
import { SPOTIFY_PLAYLIST_TRACKS } from '../../../consts';
import { getPlaylistTracks } from '../../../utils/data';
import {
  extractTrackData,
  storeAlbums,
  storeArtists,
  storePlaylistTracks,
  storeTrackInfo,
} from '../../../utils/storage';
import {
  albums,
  artists,
  playlistTracks,
  trackInfo,
} from '../../../state/atoms';

function log(...args: string[]): void {
  console.info(...args);
}

function useTrackList(id: string): {
  progress: number;
  tracks: StoredSpotifyTrack[];
} {
  const [currentPlaylistTracks, setPlaylistTracks] = useRecoilState(playlistTracks);
  const [currentTrackInfo, setTrackInfo] = useRecoilState(trackInfo);
  const [currentArtists, setArtists] = useRecoilState(artists);
  const [currentAlbums, setAlbums] = useRecoilState(albums);

  const hasTracks = !!currentPlaylistTracks[id];

  const [isFetching, setIsFetching] = useState(false);
  const [totalTracks, setTotalTracks] = useState(0);
  const [fetchedTracks, setFetchedTracks] = useState<SpotifyTrack[]>([]);
  const nextRef = useRef(SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id));

  const updateTrackData = useCallback((data: SpotifyDataExport): void => {
    log('Update cached data');

    const updatedPlaylistTracks = { ...currentPlaylistTracks, [id]: data.tracks };
    const updatedTrackInfo = { ...currentTrackInfo, ...data.trackInfo };
    const updatedArtists = { ...currentArtists, ...data.artists };
    const updatedAlbums = { ...currentAlbums, ...data.albums };

    setTrackInfo(updatedTrackInfo);
    storeTrackInfo(updatedTrackInfo);

    setArtists(updatedArtists);
    storeArtists(updatedArtists);

    setAlbums(updatedAlbums);
    storeAlbums(updatedAlbums);

    setPlaylistTracks(updatedPlaylistTracks);
    storePlaylistTracks(updatedPlaylistTracks);
  }, [
    currentAlbums,
    currentArtists,
    currentPlaylistTracks,
    currentTrackInfo,
    id,
    setAlbums,
    setArtists,
    setPlaylistTracks,
    setTrackInfo,
  ]);

  useEffect(() => {
    if (!isFetching && !hasTracks) {
      setIsFetching(true);

      log(`Fetching ${nextRef.current}`);

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
          const extracted = extractTrackData(allTracks);
          updateTrackData(extracted);
        }
      });
    }
  }, [fetchedTracks, hasTracks, id, isFetching, totalTracks, updateTrackData]);

  return {
    tracks: currentPlaylistTracks[id],
    progress: hasTracks ? 100 : ((fetchedTracks.length / totalTracks) || 0) * 100,
  };
}

export default useTrackList;
