import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Loadable,
  useRecoilState,
  useRecoilValueLoadable,
} from 'recoil';

import { playlistsQuery } from '../../../state/selectors';
import { PlaylistSnapshots, SpotifyPlaylist } from '../../../types';
import { playlistSnapshots, playlistTracks } from '../../../state/atoms';

import { removePlaylistTracksByPlaylist, saveSnapshots } from '../../../database/queries';
import DatabaseContext from '../../../database/context';

function usePlaylists(): Loadable<SpotifyPlaylist[]> {
  const db = useContext(DatabaseContext);
  const playlists = useRecoilValueLoadable(playlistsQuery);
  const [snapshots, setSnapshots] = useRecoilState(playlistSnapshots);
  const [tracks, setTracks] = useRecoilState(playlistTracks);
  const [isUpdated, setIsUpdated] = useState(false);

  const updateSnapshots = useCallback((newSnapshots: PlaylistSnapshots): void => {
    setSnapshots(newSnapshots);

    if (db) {
      saveSnapshots(db, newSnapshots);
    }
  }, [db, setSnapshots]);

  const removeTracks = useCallback((playlistId: string): void => {
    const newTrackList = { ...tracks };
    delete newTrackList[playlistId];

    setTracks(newTrackList);

    if (db) {
      removePlaylistTracksByPlaylist(db, playlistId);
    }
  }, [db, setTracks, tracks]);

  useEffect(() => {
    if (playlists.state === 'hasValue' && !isUpdated) {
      setIsUpdated(true);

      const newSnapshots = playlists.contents.reduce((acc: PlaylistSnapshots, playlist) => {
        if (
          snapshots[playlist.id]
          && snapshots[playlist.id] !== playlist.snapshot_id
        ) {
          const newTrackList = { ...tracks };
          delete newTrackList[playlist.id];

          removeTracks(playlist.id);
        }

        return {
          ...acc,
          [playlist.id]: playlist.snapshot_id,
        };
      }, {});

      updateSnapshots(newSnapshots);
    }
  }, [
    isUpdated,
    playlists.contents,
    playlists.state,
    removeTracks,
    setSnapshots,
    snapshots,
    tracks,
    updateSnapshots,
  ]);

  return playlists;
}

export default usePlaylists;
