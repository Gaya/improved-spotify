import { IndexedDBIsDb } from './createDatabase';

import { PlaylistSnapshots } from '../types';

export function getSnapshots(db: IndexedDBIsDb): Promise<PlaylistSnapshots> {
  const keysPromise = db.getAllKeys('snapshots');
  const valuesPromise = db.getAll('snapshots');

  return Promise.all([keysPromise, valuesPromise])
    .then(([keys, values]) => keys.reduce(
      (acc: PlaylistSnapshots, key, index) => ({ ...acc, [key]: values[index] }),
      {},
    ));
}

export function saveSnapshots(db: IndexedDBIsDb, snapshots: PlaylistSnapshots): Promise<void> {
  return db
    .clear('snapshots')
    .then(() => Promise.all(Object.entries(snapshots).map(
      ([key, value]) => db.put('snapshots', value, key),
    )))
    .then(() => undefined);
}

export function removePlaylistTracksByPlaylist(
  db: IndexedDBIsDb,
  playlistId: string,
): Promise<void> {
  return db.getAllKeysFromIndex('playlistTracks', 'by-playlist', playlistId)
    .then((keys) => Promise.all(keys.map((key: string) => db.delete('playlistTracks', key))))
    .then(() => undefined);
}
