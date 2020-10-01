import React, { createContext, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import createDatabase, { IndexedDBIsDb } from './createDatabase';

import FullScreenIndicator from '../components/LoadingIndicator/FullScreenIndicator';
import { getSnapshots } from './queries';
import { playlistSnapshots } from '../state/atoms';

const DatabaseContext = createContext<IndexedDBIsDb | undefined>(undefined);

export const DatabaseProvider: React.FC = ({ children }) => {
  const [isdb, setDb] = useState<IndexedDBIsDb>();
  const setSnapshots = useSetRecoilState(playlistSnapshots);

  useEffect(() => {
    createDatabase()
      .then((db) => Promise.all([
        Promise.resolve(db),
        getSnapshots(db),
      ]))
      .then(([db, snapshots]) => {
        // initialise recoil data
        setSnapshots(snapshots);

        // provide context with database
        setDb(db);
      });
  }, [setSnapshots]);

  if (!isdb) {
    return <FullScreenIndicator />;
  }

  return (
    <DatabaseContext.Provider value={isdb}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
