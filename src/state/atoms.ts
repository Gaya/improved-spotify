import { atom } from 'recoil';

import { PlaylistSnapshots, PlaylistTracksState, PlaylistView } from '../types';
import { getStoredPlaylistView } from '../components/Playlists/utils';

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
