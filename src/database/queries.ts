import { SrIndexedDB } from './createDatabase';

export function getSnapshots(db: SrIndexedDB): Promise<PlaylistSnapshots> {
  const keysPromise = db.getAllKeys('snapshots');
  const valuesPromise = db.getAll('snapshots');

  return Promise.all([keysPromise, valuesPromise])
    .then(([keys, values]) => keys.reduce(
      (acc: PlaylistSnapshots, key, index) => ({ ...acc, [key]: values[index] }),
      {},
    ));
}

export function saveSnapshots(db: SrIndexedDB, snapshots: PlaylistSnapshots): Promise<void> {
  return db
    .clear('snapshots')
    .then(() => Promise.all(Object.entries(snapshots).map(
      ([key, value]) => db.put('snapshots', value, key),
    )))
    .then(() => undefined);
}

export function storePlaylistTracks(
  db: SrIndexedDB,
  playlistTracks: StoredSpotifyPlaylistTrack[],
): Promise<void> {
  return Promise.all(playlistTracks.map((track) => db.put('playlistTracks', track)))
    .then(() => undefined);
}

export function queryPlaylistTrackKeys(
  db: SrIndexedDB,
  playlistId: string,
): Promise<string[]> {
  return db.getAllKeysFromIndex('playlistTracks', 'by-playlist', playlistId);
}

export function removePlaylistTracksByPlaylist(
  db: SrIndexedDB,
  playlistId: string,
): Promise<void> {
  return queryPlaylistTrackKeys(db, playlistId)
    .then((keys) => Promise.all(keys.map((key: string) => db.delete('playlistTracks', key))))
    .then(() => undefined);
}

export function queryPlaylistTracks(
  db: SrIndexedDB,
  playlistId: string,
): Promise<StoredSpotifyPlaylistTrack[]> {
  return db.getAllFromIndex('playlistTracks', 'by-playlist', playlistId);
}
