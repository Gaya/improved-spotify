import { atom } from 'recoil';

import {
  PlaylistSnapshots,
  StoredPlaylistTracks,
  StoredSpotifyAlbums,
  StoredSpotifyArtists,
  StoredSpotifyTrackInfo,
} from '../types';

export const playlistSnapshots = atom<PlaylistSnapshots>({
  key: 'PlaylistSnapshots',
  default: {},
});

export const albums = atom<StoredSpotifyAlbums>({
  key: 'Albums',
  default: {},
});

export const artists = atom<StoredSpotifyArtists>({
  key: 'Artists',
  default: {},
});

export const trackInfo = atom<StoredSpotifyTrackInfo>({
  key: 'TrackInfo',
  default: {},
});

export const playlistTracks = atom<StoredPlaylistTracks>({
  key: 'PlaylistTracks',
  default: {},
});
