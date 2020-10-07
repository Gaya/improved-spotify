import { PlaylistView } from '../../types';
import { STORAGE_VIEW_SETTINGS } from '../../consts';

export function getStoredPlaylistView(): PlaylistView {
  const type = localStorage.getItem(STORAGE_VIEW_SETTINGS);

  switch (type) {
    case 'ALBUM':
      return PlaylistView.ALBUM;
    default:
    case 'PLAYLIST':
      return PlaylistView.PLAYLIST;
  }
}

export function storePlaylistView(view: PlaylistView): void {
  localStorage.setItem(STORAGE_VIEW_SETTINGS, view);
}
