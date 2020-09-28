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

export function getStoredPlaylistSnapshots(): PlaylistSnapshots {
  const currentData = localStorage.getItem(STORAGE_PLAYLIST_SNAPSHOTS);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

export function storePlaylistSnapshots(snapshots: PlaylistSnapshots): void {
  localStorage.setItem(STORAGE_PLAYLIST_SNAPSHOTS, JSON.stringify(snapshots));
}

export function getStoredPlaylistTracks(): StoredPlaylistTracks {
  const currentData = localStorage.getItem(STORAGE_CACHE_DATA_PLAYLIST_TRACKS);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

export function storePlaylistTracks(tracks: StoredPlaylistTracks): void {
  localStorage.setItem(STORAGE_CACHE_DATA_PLAYLIST_TRACKS, JSON.stringify(tracks));
}

export function getStoredTrackInfo(): StoredSpotifyTrackInfo {
  const currentData = localStorage.getItem(STORAGE_CACHE_DATA_TRACK_INFO);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

export function storeTrackInfo(tracks: StoredSpotifyTrackInfo): void {
  localStorage.setItem(STORAGE_CACHE_DATA_TRACK_INFO, JSON.stringify(tracks));
}

export function getStoredAlbums(): StoredSpotifyAlbums {
  const currentData = localStorage.getItem(STORAGE_CACHE_DATA_ALBUMS);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

export function storeAlbums(albums: StoredSpotifyAlbums): void {
  localStorage.setItem(STORAGE_CACHE_DATA_ALBUMS, JSON.stringify(albums));
}

export function getStoredArtists(): StoredSpotifyArtists {
  const currentData = localStorage.getItem(STORAGE_CACHE_DATA_ARTISTS);

  if (!currentData) {
    return {};
  }

  return JSON.parse(currentData);
}

export function storeArtists(artists: StoredSpotifyArtists): void {
  localStorage.setItem(STORAGE_CACHE_DATA_ARTISTS, JSON.stringify(artists));
}

export function getSpotifyPlaylists(): Promise<SpotifyPlaylist[]> {
  return getPaged<SpotifyPlaylist>(SPOTIFY_PLAYLISTS_URI);
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

function extractAndStoreTrackData(tracksToStore: SpotifyTrack[], playlistId: string): void {
  const {
    tracks,
    trackInfo,
    artists,
    albums,
  } = extractTrackData(tracksToStore);

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

function hasTracksInStore(playlistId: string): boolean {
  const currentPlaylistTracks = getStoredPlaylistTracks();
  return !!currentPlaylistTracks[playlistId];
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
