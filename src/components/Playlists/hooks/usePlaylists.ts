import { useEffect, useState } from 'react';
import {
  Loadable,
  useRecoilState,
  useRecoilValueLoadable,
} from 'recoil';

import { playlistsQuery } from '../../../state/selectors';
import { PlaylistSnapshots, SpotifyPlaylist } from '../../../types';
import { playlistSnapshots, playlistTracks } from '../../../state/atoms';
import { removeStoredTracksOfPlaylist, storePlaylistSnapshots, storePlaylistTracks } from '../../../utils/data';

function usePlaylists(): Loadable<SpotifyPlaylist[]> {
  const playlists = useRecoilValueLoadable(playlistsQuery);
  const [snapshots, setSnapshots] = useRecoilState(playlistSnapshots);
  const [tracks, setTracks] = useRecoilState(playlistTracks);
  const [isUpdated, setIsUpdated] = useState(false);

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

          setTracks(newTrackList);
          storePlaylistTracks(newTrackList);
        }

        return {
          ...acc,
          [playlist.id]: playlist.snapshot_id,
        };
      }, {});

      setSnapshots(newSnapshots);
      storePlaylistSnapshots(newSnapshots);
    }
  }, [isUpdated, playlists.contents, playlists.state, setSnapshots, snapshots]);

  return playlists;
}

export default usePlaylists;
