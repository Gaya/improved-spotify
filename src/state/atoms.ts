import { atom } from 'recoil';

import { getStoredPlaylistView } from '../components/Playlists/utils';
import { PlaylistView } from '../enums';

export const playlistSnapshots = atom<PlaylistSnapshots>({
  key: 'PlaylistSnapshots',
  default: {},
});

export const playlistTracksState = atom<PlaylistTracksState>({
  key: 'PlaylistTracks',
  default: {},
});

export const playlistViewAs = atom<PlaylistView>({
  key: 'PlaylistViewAs',
  default: getStoredPlaylistView(),
});

export const playlistSelectedArtist = atom<string | undefined>({
  key: 'PlaylistSelectedArtist',
  default: undefined,
});

export const playlistSearchFilter = atom<string>({
  key: 'PlaylistSearchFilter',
  default: '',
});

export const currentPlaylistTracks = atom<StoredSpotifyPlaylistTrack[]>({
  key: 'CurrentPlaylistTracks',
  default: [],
});
