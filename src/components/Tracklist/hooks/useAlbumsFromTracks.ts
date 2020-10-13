import {
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  LoadableValue,
  SpotifyAlbum,
  StoredSpotifyPlaylistTrack,
} from '../../../types';
import DatabaseContext from '../../../database/context';

function sortByArtistsAndAlbum(a: SpotifyAlbum, b: SpotifyAlbum): number {
  const aArtists = a.artists.map((artist) => artist.name).join('');
  const bArtists = b.artists.map((artist) => artist.name).join('');

  if (aArtists > bArtists) {
    return 1;
  }

  if (aArtists < bArtists) {
    return -1;
  }

  if (a.name > b.name) {
    return 1;
  }

  if (a.name < b.name) {
    return -1;
  }

  return 0;
}

function useAlbumsFromTracks(
  tracks: StoredSpotifyPlaylistTrack[],
  selectedArtist?: string,
): LoadableValue<SpotifyAlbum[]> {
  const db = useContext(DatabaseContext);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>();

  const sortedAlbums = useMemo(() => {
    if (albums) {
      return [...albums]
        .filter((album): boolean => (selectedArtist
          ? !!album.artists.find((artist) => artist.id === selectedArtist)
          : true))
        .sort(sortByArtistsAndAlbum);
    }

    return [];
  }, [albums, selectedArtist]);

  if (albums) {
    return {
      state: 'hasValue',
      contents: sortedAlbums,
    };
  }

  return {
    state: 'loading',
  };
}

export default useAlbumsFromTracks;
