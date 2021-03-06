import {
  createContext,
  FC,
  useEffect,
  useState,
} from 'react';
import { useSetRecoilState } from 'recoil';

import createDatabase, { SrIndexedDB } from './createDatabase';

import FullScreenIndicator from '../components/LoadingIndicator/FullScreenIndicator';
import { getSnapshots } from './queries';
import { playlistSnapshots } from '../state/atoms';

const DatabaseContext = createContext<SrIndexedDB | undefined>(undefined);

export const DatabaseProvider: FC = ({ children }) => {
  const [isDb, setDb] = useState<SrIndexedDB>();
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

  if (!isDb) {
    return <FullScreenIndicator />;
  }

  return (
    <DatabaseContext.Provider value={isDb}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
