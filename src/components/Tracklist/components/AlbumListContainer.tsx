import React from 'react';

import { StoredSpotifyPlaylistTrack } from '../../../types';

import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';

import useAlbumsFromTracks from '../hooks/useAlbumsFromTracks';
import AlbumList from './AlbumList';

interface AlbumTrackListContainerProps {
  tracks: StoredSpotifyPlaylistTrack[];
}

const AlbumListContainer: React.FC<AlbumTrackListContainerProps> = ({ tracks }) => {
  const albums = useAlbumsFromTracks(tracks);

  if (albums.state === 'loading') {
    return <LoadingIndicator />;
  }

  if (albums.state === 'hasError') {
    return <div>Error loading albums</div>;
  }

  return (
    <AlbumList albums={albums.contents} />
  );
};

export default AlbumListContainer;
