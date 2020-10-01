import { openDB, DBSchema, IDBPDatabase } from 'idb';

const version = 1;

interface IsDb extends DBSchema {
  snapshots: {
    key: string;
    value: string;
  };
}

export type IndexedDBIsDb = IDBPDatabase<IsDb>;

function createDatabase(): Promise<IndexedDBIsDb> {
  return openDB<IsDb>('ISDB', version, {
    upgrade(db) {
      db.createObjectStore('snapshots');
    },
  });
}

export default createDatabase;
