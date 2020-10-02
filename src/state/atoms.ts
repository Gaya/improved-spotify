import { atom } from 'recoil';

import { PlaylistSnapshots, PlaylistTracksState } from '../types';

export const playlistSnapshots = atom<PlaylistSnapshots>({
  key: 'PlaylistSnapshots',
  default: {},
});

export const playlistTracksState = atom<PlaylistTracksState>({
  key: 'PlaylistTracks',
  default: {},
});
