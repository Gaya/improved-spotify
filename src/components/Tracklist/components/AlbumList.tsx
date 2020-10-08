import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';

import { SpotifyAlbum } from '../../../types';

import AlbumListItem from './AlbumListItem';

const useStyles = makeStyles({
  listContainer: {
    overflowY: 'scroll',
  },
  albumGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 260px)',
    justifyContent: 'space-between',
    columnGap: 24,
  },
});

interface AlbumTrackListProps {
  albums: SpotifyAlbum[];
}

const AlbumList: React.FC<AlbumTrackListProps> = ({ albums }) => {
  const styles = useStyles();

  return (
    <div className={styles.listContainer}>
      <Container className={styles.albumGrid}>
        {albums.map((album) => <AlbumListItem key={album.id} album={album} />)}
      </Container>
    </div>
  );
};

export default AlbumList;
