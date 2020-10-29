import {
  SPOTIFY_ALBUM_TRACKS,
  SPOTIFY_ME_URI,
  SPOTIFY_PLAYER_NEXT_URI,
  SPOTIFY_PLAYER_PAUSE_URI,
  SPOTIFY_PLAYER_PLAY_URI,
  SPOTIFY_PLAYER_PREVIOUS_URI,
  SPOTIFY_PLAYER_QUEUE_URI,
  SPOTIFY_PLAYLISTS_URI,
} from '../consts';

import {
  get,
  getPaged,
  postWithoutParsing,
  putWithoutParsing,
} from './authRequest';
import { urlWithQueryString } from './request';

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

export function playerNext(): Promise<Response> {
  return postWithoutParsing(SPOTIFY_PLAYER_NEXT_URI);
}

export function playerPrevious(): Promise<Response> {
  return postWithoutParsing(SPOTIFY_PLAYER_PREVIOUS_URI);
}

export function playerPlay(
  // eslint-disable-next-line camelcase
  options?: { context_uri?: string; uris?: string[] },
  deviceId?: string,
): Promise<Response> {
  return putWithoutParsing(
    // eslint-disable-next-line camelcase
    urlWithQueryString(SPOTIFY_PLAYER_PLAY_URI, { device_id: deviceId }),
    options,
  );
}

export function playerPause(): Promise<Response> {
  return putWithoutParsing(SPOTIFY_PLAYER_PAUSE_URI);
}
