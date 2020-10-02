import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Loadable,
  useRecoilState,
  useRecoilValueLoadable, useSetRecoilState,
} from 'recoil';

import { playlistsQuery } from '../../../state/selectors';
import {
  PlaylistSnapshots,
  PlaylistTracksState,
  SpotifyPlaylist,
  TrackState,
} from '../../../types';
import { playlistSnapshots, playlistTracksState } from '../../../state/atoms';

import { saveSnapshots } from '../../../database/queries';
import DatabaseContext from '../../../database/context';

function usePlaylists(): Loadable<SpotifyPlaylist[]> {
  const db = useContext(DatabaseContext);
  const playlists = useRecoilValueLoadable(playlistsQuery);
  const [snapshots, setSnapshots] = useRecoilState(playlistSnapshots);
  const setTracksState = useSetRecoilState(playlistTracksState);
  const [isUpdated, setIsUpdated] = useState(false);

  const updateSnapshots = useCallback((
    newSnapshots: PlaylistSnapshots,
    playlistTracksStates: PlaylistTracksState,
  ): void => {
    setSnapshots(newSnapshots);
    setTracksState(playlistTracksStates);

    if (db) {
      saveSnapshots(db, newSnapshots);
    }
  }, [db, setSnapshots, setTracksState]);

  useEffect(() => {
    if (playlists.state === 'hasValue' && !isUpdated) {
      setIsUpdated(true);

      const newSnapshots = playlists.contents.reduce((acc: PlaylistSnapshots, playlist) => ({
        ...acc,
        [playlist.id]: playlist.snapshot_id,
      }), {});

      const playlistTracksStates = playlists.contents
        .reduce((acc: PlaylistTracksState, playlist) => ({
          ...acc,
          [playlist.id]: snapshots[playlist.id] && snapshots[playlist.id] === playlist.snapshot_id
            ? TrackState.VALID : TrackState.INVALID,
        }), {});

      updateSnapshots(newSnapshots, playlistTracksStates);
    }
  }, [
    isUpdated,
    playlists.contents,
    playlists.state,
    snapshots,
    updateSnapshots,
  ]);

  return playlists;
}

export default usePlaylists;
