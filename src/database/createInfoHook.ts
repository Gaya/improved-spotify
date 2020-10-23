import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import DatabaseContext from './context';
import { SrIndexedDB } from './createDatabase';

function createInfoHook<T, S = string>(
  query: (db: SrIndexedDB, id: S) => Promise<T | undefined>,
): (id?: S) => LoadableValue<T> {
  function useInfoHook(id?: S): LoadableValue<T> {
    // needs to keep track of mount state because we use this in a React Window List
    const isMounted = useRef(false);
    const db = useContext(DatabaseContext);
    const [contents, setContents] = useState<T>();
    const [error, setError] = useState<Error>();

    useEffect(() => {
      isMounted.current = true;

      if (!db) {
        setError(new Error('Database not loaded'));
      } else if (db && id) {
        query(db, id)
          .then((result) => {
            if (!isMounted.current) return;
            setContents(result);
          })
          .catch((err) => {
            if (!isMounted.current) return;
            setError(err);
          });
      }

      return (): void => {
        isMounted.current = false;
      };
    }, [db, id]);

    if (error) {
      return {
        state: 'hasError',
        contents: error,
      };
    }

    if (contents) {
      return {
        state: 'hasValue',
        contents,
      };
    }

    return {
      state: 'loading',
    };
  }

  return useInfoHook;
}

export default createInfoHook;
