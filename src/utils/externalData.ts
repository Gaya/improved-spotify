import {
  SPOTIFY_ALBUM_TRACKS,
  SPOTIFY_ME_URI,
  SPOTIFY_PLAYER_CURRENT_URI,
  SPOTIFY_PLAYER_QUEUE_URI,
  SPOTIFY_PLAYLISTS_URI,
} from '../consts';

import { get, getPaged, postWithoutParsing } from './authRequest';
import {
  PagedResponse,
  SpotifyCurrentTrack,
  SpotifyPlaylist,
  SpotifyPlaylistTrack,
  SpotifyTrackInfo,
  SpotifyUser,
} from '../types';

export function getUserInformation(): Promise<SpotifyUser> {
  return get(SPOTIFY_ME_URI);
}

export function getSpotifyPlaylists(): Promise<SpotifyPlaylist[]> {
  return getPaged<SpotifyPlaylist>(SPOTIFY_PLAYLISTS_URI);
}

export function getPlaylistTracks(uri: string): Promise<PagedResponse<SpotifyPlaylistTrack>> {
  return get<PagedResponse<SpotifyPlaylistTrack>>(uri);
}

export function addToQueue(uri: string): Promise<Response> {
  return postWithoutParsing(`${SPOTIFY_PLAYER_QUEUE_URI}?uri=${uri}`);
}

export function getAlbumTracks(id: string): Promise<SpotifyTrackInfo[]> {
  return getPaged<SpotifyTrackInfo>(SPOTIFY_ALBUM_TRACKS.replace('{id}', id));
}

export function getCurrentPlaying(): Promise<SpotifyCurrentTrack> {
  return get(SPOTIFY_PLAYER_CURRENT_URI);
}
