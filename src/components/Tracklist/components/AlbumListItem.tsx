import React, { useState } from 'react';
import classNames from 'classnames';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';

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
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#010102',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
    marginBottom: theme.spacing(1),
    width: 260,
    height: 260,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
  },
  buttons: {
    backgroundColor: theme.palette.background.default,
    opacity: 0,
    transition: 'opacity ease 0.1s',
  },
  buttonsHover: {
    opacity: 1,
  },
}));

interface AlbumListItemProps {
  album: SpotifyAlbum;
  style: React.CSSProperties;
}

const AlbumListItem: React.FC<AlbumListItemProps> = ({ album, style }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [isHovering, setIsHovering] = useState(false);

  const artistsText = album.artists.map((a) => a.name).join(', ');

  return (
    <div style={style} key={album.id} className={styles.container}>
      <div className={styles.album}>
        <div
          onMouseEnter={(): void => setIsHovering(true)}
          onMouseLeave={(): void => setIsHovering(false)}
          className={styles.cover}
          style={{ backgroundImage: `url(${album.images[0].url})` }}
        >
          <ButtonGroup
            className={classNames(styles.buttons, { [styles.buttonsHover]: isHovering })}
            orientation="vertical"
          >
            <Button size="large" startIcon={<PlayArrowIcon />}>Play Now</Button>
            <Button size="large" startIcon={<QueueMusicIcon />}>Add to Queue</Button>
          </ButtonGroup>
        </div>
        <Typography noWrap>
          {album.name}
        </Typography>
        <Typography color="textSecondary" noWrap variant="body2">
          {artistsText}
        </Typography>
      </div>
    </div>
  );
};

export default AlbumListItem;
