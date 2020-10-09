import React from 'react';

import { StoredSpotifyPlaylistTrack } from '../../../types';

import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';
import CenteredContainer from '../../CenteredContainer/CenteredContainer';

import useAlbumsFromTracks from '../hooks/useAlbumsFromTracks';

import AlbumList from './AlbumList';

interface AlbumTrackListContainerProps {
  tracks: StoredSpotifyPlaylistTrack[];
}

const AlbumListContainer: React.FC<AlbumTrackListContainerProps> = ({ tracks }) => {
  const albums = useAlbumsFromTracks(tracks);

  if (albums.state === 'loading') {
    return <CenteredContainer><LoadingIndicator /></CenteredContainer>;
  }

  if (albums.state === 'hasError') {
    return <CenteredContainer><div>Error loading albums</div></CenteredContainer>;
  }

  return (
    <AlbumList albums={albums.contents} />
  );
};

export default AlbumListContainer;
