import React from 'react';

import { StoredSpotifyPlaylistTrack } from '../../../types';

interface AlbumTrackListProps {
  tracks: StoredSpotifyPlaylistTrack[];
}

const AlbumTrackList: React.FC<AlbumTrackListProps> = () => {
  const test = 1;

  return (
    <div>Albums</div>
  );
};

export default AlbumTrackList;
