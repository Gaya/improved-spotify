import { useCallback, useEffect, useState } from 'react';
import {
  Loadable,
  useRecoilState,
  useRecoilValueLoadable,
} from 'recoil';

import { playlistsQuery } from '../../../state/selectors';
import { PlaylistSnapshots, SpotifyPlaylist, StoredPlaylistTracks } from '../../../types';
import { playlistSnapshots, playlistTracks } from '../../../state/atoms';
import { storePlaylistSnapshots, storePlaylistTracks } from '../../../utils/storage';

function usePlaylists(): Loadable<SpotifyPlaylist[]> {
  const playlists = useRecoilValueLoadable(playlistsQuery);
  const [snapshots, setSnapshots] = useRecoilState(playlistSnapshots);
  const [tracks, setTracks] = useRecoilState(playlistTracks);
  const [isUpdated, setIsUpdated] = useState(false);

  const updateSnapshots = useCallback((newSnapshots: PlaylistSnapshots): void => {
    setSnapshots(newSnapshots);
    storePlaylistSnapshots(newSnapshots);
  }, [setSnapshots]);

  const updateTracks = useCallback((newPlaylistTracks: StoredPlaylistTracks): void => {
    setTracks(newPlaylistTracks);
    storePlaylistTracks(newPlaylistTracks);
  }, [setTracks]);

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

          updateTracks(newTrackList);
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
    setSnapshots,
    snapshots,
    tracks,
    updateSnapshots,
    updateTracks,
  ]);

  return playlists;
}

export default usePlaylists;
