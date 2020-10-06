import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { LoadableValue, StoredSpotifyTrack } from '../../../types';
import DatabaseContext from '../../../database/context';
import { queryTrackInfo } from '../../../database/queries';

function useTrackInfo(id: string): LoadableValue<StoredSpotifyTrack> {
  // needs to keep track of mount state because we use this in a React Window List
  const isMounted = useRef(false);
  const db = useContext(DatabaseContext);

  useEffect(() => {
    isMounted.current = true;

    if (db) {
      queryTrackInfo(db, id)
        .then((track) => {
          if (!isMounted.current) return;
          setTrack(track);
        })
        .catch((error) => {
          if (!isMounted.current) return;
          setError(error);
        });
    } else {
      setError(new Error('Database not loaded'));
    }

    return (): void => {
      isMounted.current = false;
    };
  }, [db, id]);

  const [track, setTrack] = useState<StoredSpotifyTrack>();
  const [error, setError] = useState<Error>();

  if (error) {
    return {
      state: 'hasError',
      contents: error,
    };
  }

  if (track) {
    return {
      state: 'hasValue',
      contents: track,
    };
  }

  return {
    state: 'loading',
  };
}

export default useTrackInfo;
