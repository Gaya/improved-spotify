import React, { useCallback, useState } from 'react';
import classNames from 'classnames';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

import { SpotifyAlbum } from '../../../types';
import { addToQueue, getAlbumTracks } from '../../../utils/externalData';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  album: {
    width: 260,
  },
  cover: {
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: theme.palette.background.paper,
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
  style?: React.CSSProperties;
}

function promiseSerial<T>(promises: Promise<T>[], results: T[] = []): Promise<T[]> {
  if (promises.length === 0) {
    return Promise.resolve(results);
  }

  const [next, ...remaining] = promises;

  return next.then((result) => promiseSerial(remaining, [...results, result]));
}

const AlbumListItem: React.FC<AlbumListItemProps> = ({ album, style }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [isHovering, setIsHovering] = useState(false);
  const [isQueuing, setIsQueuing] = useState(false);
  const [queueTooltip, setQueueTooltip] = useState(false);

  const showQueueTooltip = (): void => {
    setQueueTooltip(true);
    setTimeout(() => setQueueTooltip(false), 3000);
  };

  const artistsText = album.artists.map((a) => a.name).join(', ');

  const addAlbumToQueue = useCallback(() => {
    if (isQueuing) {
      return;
    }

    setIsQueuing(true);

    getAlbumTracks(album.id)
      .then((tracks) => promiseSerial(tracks.map((track) => addToQueue(track.uri))))
      .then(() => {
        setIsQueuing(false);
        showQueueTooltip();
      });
  }, [album.id, isQueuing]);

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
            className={
              classNames(styles.buttons, { [styles.buttonsHover]: isHovering || isQueuing })
            }
            orientation="vertical"
          >
            <Tooltip
              open={queueTooltip}
              title="Added to Queue"
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <Button
                size="large"
                startIcon={isQueuing ? <CircularProgress size={16} color="inherit" /> : <QueueMusicIcon />}
                onClick={addAlbumToQueue}
              >
                Add to Queue
              </Button>
            </Tooltip>
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
