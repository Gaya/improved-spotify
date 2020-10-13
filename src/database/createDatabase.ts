import { openDB, DBSchema, IDBPDatabase } from 'idb';

import { StoredSpotifyPlaylistTrack } from '../types';
import { error } from '../utils/logging';

const version = 1;

interface SrDb extends DBSchema {
  snapshots: {
    key: string;
    value: string;
  };
  playlistTracks: {
    key: string;
    value: StoredSpotifyPlaylistTrack;
    indexes: {
      'by-date': string;
      'by-playlist': string;
    };
  };
}

export type SrIndexedDB = IDBPDatabase<SrDb>;

function createDatabase(): Promise<SrIndexedDB> {
  return openDB<SrDb>('SRDB', version, {
    upgrade(db) {
      // SNAPSHOTS
      db.createObjectStore('snapshots');

      // PLAYLIST TRACKS
      const playlistTracks = db.createObjectStore('playlistTracks', {
        keyPath: 'id',
      });
      playlistTracks.createIndex('by-date', 'added_at');
      playlistTracks.createIndex('by-playlist', 'playlistId');
    },
  }).catch((err) => {
    error(err);
    throw err;
  });
}

export default createDatabase;
