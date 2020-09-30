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

function useTrackList(id: string): {
  totalTracks: number;
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
  const tracksRef = useRef<SpotifyTrack[]>([]);
  const nextRef = useRef(SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id));

  useEffect(() => {
    tracksRef.current = [];
    nextRef.current = SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id);
  }, [id]);

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
    if (!isFetching && !hasTracks) {
      setIsFetching(true);

      getPlaylistTracks(nextRef.current).then((response) => {
        const allTracks = [...tracksRef.current, ...response.items];
        tracksRef.current = allTracks;
        setTotalTracks(response.total);

        if (response.next) {
          nextRef.current = response.next;
          setIsFetching(false);
        } else {
          const extracted = extractTrackData(allTracks);
          updateTrackData(extracted);
        }
      });
    }
  }, [
    hasTracks,
    id,
    isFetching,
    updateTrackData,
  ]);

  return {
    tracks: currentPlaylistTracks[id],
    progress: hasTracks ? 100 : (tracksRef.current.length / totalTracks) * 100,
    totalTracks,
  };
}

export default useTrackList;
