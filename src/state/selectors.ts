import { selector, selectorFamily } from 'recoil';

import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyUser,
} from '../types';

import { getSpotifyPlaylists, getUserInformation } from '../utils/externalData';

import { currentPlaylistTracks, playlistSearchFilter, playlistSelectedArtist } from './atoms';

export const userInformationQuery = selector({
  key: 'UserInformation',
  get(): Promise<SpotifyUser> {
    return getUserInformation();
  },
});

export const playlistsQuery = selector({
  key: 'Playlists',
  get(): Promise<SpotifyPlaylist[]> {
    return getSpotifyPlaylists();
  },
});

export const playlistQuery = selectorFamily({
  key: 'Playlist',
  get: (id: string) => ({
    get: getRecoil,
  }): SpotifyPlaylist | undefined => getRecoil(playlistsQuery)
    .find((playlist) => playlist.id === id),
});

function sortByName(a: SpotifyArtist, b: SpotifyArtist): number {
  if (a.name > b.name) {
    return 1;
  }

  if (a.name < b.name) {
    return -1;
  }

  return 0;
}

export const artistsFromCurrentTracks = selector({
  key: 'ArtistsFromCurrentTracks',
  get({ get: getRecoil }): SpotifyArtist[] {
    const tracks = getRecoil(currentPlaylistTracks);

    // use this cache to prevent using slower .find
    const addedArtists: { [key: string]: boolean } = {};

    const artists = tracks.reduce((acc: SpotifyArtist[], playlistTrack) => {
      const newArtists = playlistTrack.track.album.artists
        .filter((artist) => !addedArtists[artist.id]);

      newArtists.forEach((artist) => {
        addedArtists[artist.id] = true;
      });

      return [...acc, ...newArtists];
    }, []);

    return [...artists].sort(sortByName);
  },
});

export const albumsFromCurrentTracks = selector({
  key: 'AlbumsFromCurrentTracks',
  get({ get: getRecoil }): SpotifyAlbum[] {
    const tracks = getRecoil(currentPlaylistTracks);

    // to improve looking up albums we use a reference object
    const addedAlbums: { [key: string]: boolean } = {};

    return tracks.reduce((acc: SpotifyAlbum[], playlistTrack) => {
      if (addedAlbums[playlistTrack.track.album.id]) {
        return acc;
      }

      addedAlbums[playlistTrack.track.album.id] = true;

      return [
        ...acc,
        {
          ...playlistTrack.track.album,
          artistsPlain: playlistTrack.track.album.artists.map((a) => a.id),
        }];
    }, []);
  },
});

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

export const sortedAndFilteredAlbums = selector({
  key: 'SortedAndFilteredAlbums',
  get({ get: getRecoil }): SpotifyAlbum[] {
    const selectedArtist = getRecoil(playlistSelectedArtist);
    const albums = getRecoil(albumsFromCurrentTracks);
    const filter = getRecoil(playlistSearchFilter);

    const matchExpression = new RegExp(filter, 'gi');

    return albums
      .filter((album): boolean => (selectedArtist
        ? !!album.artists.find((artist) => artist.id === selectedArtist)
        : true))
      .filter((album): boolean => (filter
        ? (
          !!album.name.match(matchExpression)
          || album.artists.some((artist) => artist.name.match(matchExpression))
        )
        : true))
      .sort(sortByArtistsAndAlbum);
  },
});
