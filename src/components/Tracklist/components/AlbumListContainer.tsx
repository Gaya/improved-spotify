import React, { useEffect, useRef, useState } from 'react';

import { StoredSpotifyPlaylistTrack } from '../../../types';

import useAlbumsFromTracks from '../hooks/useAlbumsFromTracks';
import AlbumList from './AlbumList';

interface AlbumTrackListContainerProps {
  tracks: StoredSpotifyPlaylistTrack[];
}

const AlbumListContainer: React.FC<AlbumTrackListContainerProps> = ({ tracks }) => {
  const albums = useAlbumsFromTracks(tracks);

  if (albums.state !== 'hasValue') {
    return null;
  }

  return (
    <AlbumList albums={albums.contents} />
  );
};

export default AlbumListContainer;
