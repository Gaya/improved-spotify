import { selector } from 'recoil';

import { SPOTIFY_ME_URI, SPOTIFY_PLAYLISTS_URI } from '../consts';

import { get, getPaged } from '../utils/authRequest';
import { SpotifyPlaylist, SpotifyUser } from '../types';

export const userInformationQuery = selector({
  key: 'UserInformation',
  get(): Promise<SpotifyUser> {
    return get(SPOTIFY_ME_URI);
  },
});

export const playlistsQuery = selector({
  key: 'Playlists',
  get(): Promise<SpotifyPlaylist[]> {
    return getPaged<SpotifyPlaylist>(SPOTIFY_PLAYLISTS_URI);
  },
});
