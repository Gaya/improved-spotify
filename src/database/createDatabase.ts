import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { StoredSpotifyTrack } from '../types';

const version = 1;

interface IsDb extends DBSchema {
  snapshots: {
    key: string;
    value: string;
  };
  playlistTracks: {
    key: string;
    value: StoredSpotifyTrack;
    indexes: {
      'by-date': string;
      'by-playlist': string;
    };
  };
}

export type IndexedDBIsDb = IDBPDatabase<IsDb>;

function createDatabase(): Promise<IndexedDBIsDb> {
  return openDB<IsDb>('ISDB', version, {
    upgrade(db) {
      db.createObjectStore('snapshots');

      const playlistTracks = db.createObjectStore('playlistTracks', {
        keyPath: 'id',
      });
      playlistTracks.createIndex('by-date', 'added_at');
      playlistTracks.createIndex('by-playlist', 'playlistId');
    },
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  });
}

export default createDatabase;
