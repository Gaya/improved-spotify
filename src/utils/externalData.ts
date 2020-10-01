import { SPOTIFY_ME_URI, SPOTIFY_PLAYLISTS_URI } from '../consts';

import { get, getPaged } from './authRequest';
import {
  PagedResponse,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyUser,
} from '../types';

export function getUserInformation(): Promise<SpotifyUser> {
  return get(SPOTIFY_ME_URI);
}

export function getSpotifyPlaylists(): Promise<SpotifyPlaylist[]> {
  return getPaged<SpotifyPlaylist>(SPOTIFY_PLAYLISTS_URI);
}

export function getPlaylistTracks(uri: string): Promise<PagedResponse<SpotifyTrack>> {
  return get<PagedResponse<SpotifyTrack>>(uri);
}
