import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';

import { SpotifyAlbum } from '../../../types';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  album: {
    width: 260,
  },
  cover: {
    width: 260,
    display: 'block',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#010102',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
    marginBottom: theme.spacing(1),
  },
}));

interface AlbumListItemProps {
  album: SpotifyAlbum;
  style: React.CSSProperties;
}

const AlbumListItem: React.FC<AlbumListItemProps> = ({ album, style }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const artistsText = album.artists.map((a) => a.name).join(', ');

  return (
    <div style={style} key={album.id} className={styles.container}>
      <div className={styles.album}>
        <img className={styles.cover} src={album.images[0].url} alt={`${album.name} - ${artistsText}`} />
        <Typography noWrap>
          {album.name}
        </Typography>
        <Typography color="textSecondary" noWrap variant="body2">{artistsText}</Typography>
      </div>
    </div>
  );
};

export default AlbumListItem;
