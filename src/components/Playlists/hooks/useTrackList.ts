import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';

import { SpotifyDataExport, SpotifyPlaylistTrack, StoredSpotifyPlaylistTrack } from '../../../types';
import { SPOTIFY_PLAYLIST_TRACKS } from '../../../consts';
import { getPlaylistTracks } from '../../../utils/externalData';
import extractTrackData from '../../../utils/extractTrackData';
import {
  albums,
  artists,
  playlistTracks,
  trackInfo,
} from '../../../state/atoms';
import DatabaseContext from '../../../database/context';
import { storeDataExport } from '../../../database/queries';

function log(...args: string[]): void {
  // eslint-disable-next-line no-console
  console.info(...args);
}

function useTrackList(id: string): {
  progress: number;
  tracks: StoredSpotifyPlaylistTrack[];
} {
  const db = useContext(DatabaseContext);
  const [currentPlaylistTracks, setPlaylistTracks] = useRecoilState(playlistTracks);
  const [currentTrackInfo, setTrackInfo] = useRecoilState(trackInfo);
  const [currentArtists, setArtists] = useRecoilState(artists);
  const [currentAlbums, setAlbums] = useRecoilState(albums);

  const hasTracks = !!currentPlaylistTracks[id];

  const [isFetching, setIsFetching] = useState(false);
  const [totalTracks, setTotalTracks] = useState(0);
  const [fetchedTracks, setFetchedTracks] = useState<SpotifyPlaylistTrack[]>([]);
  const nextRef = useRef(SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id));

  const updateTrackData = useCallback((data: SpotifyDataExport): void => {
    log('Update cached data');

    if (db) {
      storeDataExport(db, data);
    }

    const updatedPlaylistTracks = { ...currentPlaylistTracks, [id]: data.playlistTracks };
    const updatedTrackInfo = { ...currentTrackInfo, ...data.tracks };
    const updatedArtists = { ...currentArtists, ...data.artists };
    const updatedAlbums = { ...currentAlbums, ...data.albums };

    setTrackInfo(updatedTrackInfo);
    setArtists(updatedArtists);
    setAlbums(updatedAlbums);
    setPlaylistTracks(updatedPlaylistTracks);
  }, [
    currentAlbums,
    currentArtists,
    currentPlaylistTracks,
    currentTrackInfo,
    db,
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
          const extracted = extractTrackData(id, allTracks);
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
