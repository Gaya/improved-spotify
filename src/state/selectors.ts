import { selector, selectorFamily } from 'recoil';

import {
  SpotifyPlaylist,
  SpotifyUser,
} from '../types';

import { getSpotifyPlaylists, getUserInformation } from '../utils/data';

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
