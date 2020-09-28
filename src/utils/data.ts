import { SPOTIFY_ME_URI, SPOTIFY_PLAYLISTS_URI } from '../consts';

import { get, getPaged } from './authRequest';
import {
  PagedResponse,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyUser,
} from '../types';
import { extractAndStoreTrackData, hasTracksInStore } from './storage';

export function getUserInformation(): Promise<SpotifyUser> {
  return get(SPOTIFY_ME_URI);
}

export function getSpotifyPlaylists(): Promise<SpotifyPlaylist[]> {
  return getPaged<SpotifyPlaylist>(SPOTIFY_PLAYLISTS_URI);
}

export function getPlaylistTracks(
  uri: string,
  prevTracks: SpotifyTrack[],
  playlistId: string,
): Promise<PagedResponse<SpotifyTrack>> {
  if (hasTracksInStore(playlistId)) {
    // @todo get and parse tracks

    return Promise.resolve({
      items: [],
      total: 0,
      href: '',
      limit: 0,
      offset: 0,
      next: null,
      previous: null,
    });
  }

  return get<PagedResponse<SpotifyTrack>>(uri)
    .then((response) => {
      if (!response.next) {
        // done with paging, store information
        extractAndStoreTrackData([...prevTracks, ...response.items], playlistId);
      }

      return response;
    });
}
