import { useMemo } from 'react';

import {
  SpotifyAlbum,
  StoredSpotifyPlaylistTrack,
} from '../../../types';

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
): SpotifyAlbum[] {
  // to improve looking up albums we use a reference object
  const addedAlbums: { [key: string]: boolean } = {};

  const albums = tracks.reduce((acc: SpotifyAlbum[], playlistTrack) => {
    if (addedAlbums[playlistTrack.track.album.id]) {
      return acc;
    }

    addedAlbums[playlistTrack.track.album.id] = true;

    return [...acc, playlistTrack.track.album];
  }, []);

  return useMemo(() => [...albums]
    .filter((album): boolean => (selectedArtist
      ? !!album.artists.find((artist) => artist.id === selectedArtist)
      : true))
    .sort(sortByArtistsAndAlbum), [albums, selectedArtist]);
}

export default useAlbumsFromTracks;
