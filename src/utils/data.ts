import {
  SPOTIFY_ME_URI,
  SPOTIFY_PLAYLISTS_URI,
  STORAGE_CACHE_DATA_PLAYLIST_TRACKS,
  STORAGE_PLAYLIST_SNAPSHOTS,
} from '../consts';

import { get, getPaged } from './authRequest';
import {
  PagedResponse,
  PlaylistSnapshots,
  PlaylistTracks,
  SpotifyPlaylist, SpotifyTrack,
  SpotifyUser,
} from '../types';

export function getUserInformation(): Promise<SpotifyUser> {
  return get(SPOTIFY_ME_URI);
}

function getStoredPlaylistSnapshots(): PlaylistSnapshots {
  const currentData = localStorage.getItem(STORAGE_PLAYLIST_SNAPSHOTS);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

function storePlaylistSnapshots(snapshots: PlaylistSnapshots): void {
  localStorage.setItem(STORAGE_PLAYLIST_SNAPSHOTS, JSON.stringify(snapshots));
}

function getStoredPlaylistTracks(): PlaylistTracks {
  const currentData = localStorage.getItem(STORAGE_CACHE_DATA_PLAYLIST_TRACKS);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

function storePlaylistTracks(tracks: PlaylistTracks): void {
  localStorage.setItem(STORAGE_CACHE_DATA_PLAYLIST_TRACKS, JSON.stringify(tracks));
}

function removeStoredTracksOfPlaylist(id: string): void {
  const currentPlaylistTracks = getStoredPlaylistTracks();
  delete currentPlaylistTracks[id];

  storePlaylistTracks(currentPlaylistTracks);
}

export function getSpotifyPlaylists(): Promise<SpotifyPlaylist[]> {
  const currentSnapshots = getStoredPlaylistSnapshots();

  return getPaged<SpotifyPlaylist>(SPOTIFY_PLAYLISTS_URI)
    .then((playlists) => {
      const newSnapshots = playlists.reduce((acc: PlaylistSnapshots, playlist) => {
        if (
          currentSnapshots[playlist.id]
          && currentSnapshots[playlist.id] !== playlist.snapshot_id
        ) {
          removeStoredTracksOfPlaylist(playlist.id);
        }

        return {
          ...acc,
          [playlist.id]: playlist.snapshot_id,
        };
      }, {});

      storePlaylistSnapshots(newSnapshots);

      return playlists;
    });
}

export function getPlaylistTracks(
  uri: string,
  prevTracks: SpotifyTrack[],
): Promise<PagedResponse<SpotifyTrack>> {
  return get<PagedResponse<SpotifyTrack>>(uri)
    .then((response) => {
      if (!response.next) {
        // save the tracks
        const tracks = [...prevTracks, ...response.items];
        console.log(tracks);
      }

      return response;
    });
}
