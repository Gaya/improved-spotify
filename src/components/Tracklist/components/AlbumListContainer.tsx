import React from 'react';

import Container from '@material-ui/core/Container';

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
    return <Container><LoadingIndicator /></Container>;
  }

  if (albums.state === 'hasError') {
    return <Container><div>Error loading albums</div></Container>;
  }

  return (
    <AlbumList albums={albums.contents} />
  );
};

export default AlbumListContainer;
