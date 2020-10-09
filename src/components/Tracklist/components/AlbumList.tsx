import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

import { SpotifyAlbum } from '../../../types';

import Container from '../../Container/Container';

import AlbumListItem from './AlbumListItem';

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
  albums: SpotifyAlbum[];
}

const AlbumList: React.FC<AlbumTrackListProps> = ({ albums }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

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
