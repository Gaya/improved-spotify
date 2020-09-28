import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';

import { SpotifyDataExport, SpotifyTrack } from '../../../types';
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

function useTrackList(id: string): {
  totalTracks: number;
  progress: number;
  tracks: SpotifyTrack[];
} {
  const [currentPlaylistTracks, setPlaylistTracks] = useRecoilState(playlistTracks);
  const [currentTrackInfo, setTrackInfo] = useRecoilState(trackInfo);
  const [currentArtists, setArtists] = useRecoilState(artists);
  const [currentAlbums, setAlbums] = useRecoilState(albums);

  // @todo convert currentPlaylistTracks to SpotifyTracks and prevent fetching

  const [isFetching, setIsFetching] = useState(false);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const nextRef = useRef(SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id));

  const updateTrackData = useCallback((data: SpotifyDataExport): void => {
    const updatedPlaylistTracks = { ...currentPlaylistTracks, [id]: data.tracks };
    const updatedTrackInfo = { ...currentTrackInfo, ...data.trackInfo };
    const updatedArtists = { ...currentArtists, ...data.artists };
    const updatedAlbums = { ...currentAlbums, ...data.albums };

    setPlaylistTracks(updatedPlaylistTracks);
    storePlaylistTracks(updatedPlaylistTracks);

    setTrackInfo(updatedTrackInfo);
    storeTrackInfo(updatedTrackInfo);

    setArtists(updatedArtists);
    storeArtists(updatedArtists);

    setAlbums(updatedAlbums);
    storeAlbums(updatedAlbums);
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
    if (!isFetching) {
      setIsFetching(true);

      getPlaylistTracks(nextRef.current).then((response) => {
        const allTracks = [...tracks, ...response.items];
        setTracks(allTracks);
        setTotalTracks(response.total);

        if (response.next) {
          nextRef.current = response.next;
          setIsFetching(false);
        } else {
          const extracted = extractTrackData(allTracks);
          updateTrackData(extracted);

          console.log(allTracks, extracted);
        }
      });
    }
  }, [
    currentAlbums,
    currentArtists,
    currentPlaylistTracks,
    currentTrackInfo,
    id,
    isFetching,
    tracks,
    updateTrackData,
  ]);

  return {
    tracks,
    progress: (tracks.length / totalTracks) * 100,
    totalTracks,
  };
}

export default useTrackList;
