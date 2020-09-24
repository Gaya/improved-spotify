import { selector, selectorFamily } from 'recoil';

import { SPOTIFY_ME_URI, SPOTIFY_PLAYLISTS_URI } from '../consts';

import { get, getPaged } from '../utils/authRequest';
import {
  PagedResponse,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyUser,
} from '../types';

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

export const playlistQuery = selectorFamily({
  key: 'Playlist',
  get: (id: string) => ({
    get: getRecoil,
  }): SpotifyPlaylist | undefined => getRecoil(playlistsQuery)
    .find((playlist) => playlist.id === id),
});

export const playlistTracksQuery = selectorFamily({
  key: 'PlaylistTracks',
  get: (id: string) => ({ get: getRecoil }): Promise<SpotifyTrack[]> => {
    const playlist = getRecoil(playlistsQuery)
      .find((p) => p.id === id);

    if (!playlist) {
      throw new Error(`Could not find playlist "${id}"`);
    }

    return get<PagedResponse<SpotifyTrack>>(playlist.tracks.href).then((result) => result.items);
  },
});
