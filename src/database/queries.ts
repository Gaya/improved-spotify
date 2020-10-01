import { IndexedDBIsDb } from './createDatabase';

import { PlaylistSnapshots, SpotifyDataExport } from '../types';

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

export function storeDataExport(db: IndexedDBIsDb, data: SpotifyDataExport): Promise<void> {
  return Promise.all(data.playlistTracks.map((track) => db.put('playlistTracks', track)))
    .then(() => Promise.all(Object.entries(data.albums).map(([id, album]) => db.put('albums', album))))
    .then(() => Promise.all(Object.entries(data.artists).map(([id, artist]) => db.put('artists', artist))))
    .then(() => Promise.all(Object.entries(data.tracks).map(([id, track]) => db.put('tracks', track))))
    .then(() => undefined);
}
