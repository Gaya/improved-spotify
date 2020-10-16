import { selector, selectorFamily } from 'recoil';

import {
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyUser,
} from '../types';

import { getSpotifyPlaylists, getUserInformation } from '../utils/externalData';

import { currentPlaylistTracks } from './atoms';

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
