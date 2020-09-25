import {
  SPOTIFY_ME_URI,
  SPOTIFY_PLAYLISTS_URI, STORAGE_CACHE_DATA_ALBUMS, STORAGE_CACHE_DATA_ARTISTS,
  STORAGE_CACHE_DATA_PLAYLIST_TRACKS, STORAGE_CACHE_DATA_TRACK_INFO,
  STORAGE_PLAYLIST_SNAPSHOTS,
} from '../consts';

import { get, getPaged } from './authRequest';
import {
  PagedResponse,
  PlaylistSnapshots,
  SpotifyDataExport,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyUser,
  StoredPlaylistTracks,
  StoredSpotifyAlbums,
  StoredSpotifyArtists,
  StoredSpotifyTrackInfo,
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

function getStoredPlaylistTracks(): StoredPlaylistTracks {
  const currentData = localStorage.getItem(STORAGE_CACHE_DATA_PLAYLIST_TRACKS);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

function storePlaylistTracks(tracks: StoredPlaylistTracks): void {
  localStorage.setItem(STORAGE_CACHE_DATA_PLAYLIST_TRACKS, JSON.stringify(tracks));
}

function removeStoredTracksOfPlaylist(id: string): void {
  const currentPlaylistTracks = getStoredPlaylistTracks();
  delete currentPlaylistTracks[id];

  storePlaylistTracks(currentPlaylistTracks);
}

function getStoredTrackInfo(): StoredSpotifyTrackInfo {
  const currentData = localStorage.getItem(STORAGE_CACHE_DATA_TRACK_INFO);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

function storeTrackInfo(tracks: StoredSpotifyTrackInfo): void {
  localStorage.setItem(STORAGE_CACHE_DATA_TRACK_INFO, JSON.stringify(tracks));
}

function getStoredAlbums(): StoredSpotifyAlbums {
  const currentData = localStorage.getItem(STORAGE_CACHE_DATA_ALBUMS);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

function storeAlbums(albums: StoredSpotifyAlbums): void {
  localStorage.setItem(STORAGE_CACHE_DATA_ALBUMS, JSON.stringify(albums));
}

function getStoredArtists(): StoredSpotifyArtists {
  const currentData = localStorage.getItem(STORAGE_CACHE_DATA_ARTISTS);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

function storeArtists(artists: StoredSpotifyArtists): void {
  localStorage.setItem(STORAGE_CACHE_DATA_ARTISTS, JSON.stringify(artists));
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

export function extractTrackData(tracks: SpotifyTrack[]): SpotifyDataExport {
  const extractedData = tracks.reduce((acc: Omit<SpotifyDataExport, 'tracks'>, { track }) => ({
    trackInfo: {
      ...acc.trackInfo,
      [track.id]: {
        ...track,
        album: track.album.id,
        artists: track.artists.map((artist) => artist.id),
      },
    },
    artists: track.artists.reduce((accArtists, artist) => ({
      ...accArtists,
      [artist.id]: artist,
    }), acc.artists),
    albums: {
      ...acc.albums,
      [track.album.id]: {
        ...track.album,
        artists: track.artists.map((artist) => artist.id),
      },
    },
  }), { trackInfo: {}, artists: {}, albums: {} });

  return {
    ...extractedData,
    tracks: tracks.map((track) => ({ ...track, track: track.track.id })),
  };
}

export function getPlaylistTracks(
  uri: string,
  prevTracks: SpotifyTrack[],
  playlistId: string,
): Promise<PagedResponse<SpotifyTrack>> {
  return get<PagedResponse<SpotifyTrack>>(uri)
    .then((response) => {
      if (!response.next) {
        const {
          tracks,
          trackInfo,
          artists,
          albums,
        } = extractTrackData([...prevTracks, ...response.items]);

        // save data to local storage
        const currentPlaylistTracks = getStoredPlaylistTracks();
        storePlaylistTracks({ ...currentPlaylistTracks, [playlistId]: tracks });

        const currentTrackInfo = getStoredTrackInfo();
        storeTrackInfo({ ...currentTrackInfo, ...trackInfo });

        const currentArtists = getStoredArtists();
        storeArtists({ ...currentArtists, ...artists });

        const currentAlbums = getStoredAlbums();
        storeAlbums({ ...currentAlbums, ...albums });
      }

      return response;
    });
}
