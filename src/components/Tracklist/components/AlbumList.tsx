import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

import { StoredSpotifyPlaylistTrack } from '../../../types';

import Container from '../../Container/Container';

import AlbumListItem from './AlbumListItem';
import useAlbumsFromTracks from '../hooks/useAlbumsFromTracks';

const useStyles = makeStyles((theme) => ({
  listContainer: {
    overflowY: 'scroll',
  },
  albumGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 260px)',
    justifyContent: 'space-around',
    columnGap: 24,
    [theme.breakpoints.up('lg')]: {
      justifyContent: 'space-between',
    },
  },
}));

interface AlbumTrackListProps {
  tracks: StoredSpotifyPlaylistTrack[];
  selectedArtist?: string;
}

const AlbumList: React.FC<AlbumTrackListProps> = ({ tracks, selectedArtist }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const albums = useAlbumsFromTracks(tracks, selectedArtist);

  return (
    <div className={styles.listContainer}>
      <Container>
        <div className={styles.albumGrid}>
          {albums.map((album) => <AlbumListItem key={album.id} album={album} />)}
        </div>
      </Container>
    </div>
  );
};

export default AlbumList;
