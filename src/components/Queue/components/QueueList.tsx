import { FC, useCallback } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

const useStyles = makeStyles((theme) => ({
  empty: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
  },
  item: {
    display: 'flex',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.divider,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    padding: theme.spacing(1),
    justifyContent: 'center',
  },
  iconButton: {
    padding: 0,
    flexGrow: 0,
  },
  itemInfo: {
    flexGrow: 1,
  },
  itemAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    flexGrow: 0,
  },
}));

interface QueueListProps {
  emptyText: string;
  tracks: SpotifyAlbumTrack[];
  onRemove?: (index?: number) => void;
}

const QueueList: FC<QueueListProps> = ({ emptyText, tracks, onRemove }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const clearQueue = useCallback(() => {
    if (onRemove) {
      onRemove();
    }
  }, [onRemove]);

  if (tracks.length === 0) {
    return <div className={styles.empty}>{emptyText}</div>;
  }

  return (
    <>
      {tracks.map((track, index) => (
        <div className={styles.item} key={track.id}>
          <div className={styles.itemInfo} style={{ maxWidth: onRemove ? 206 : 234 }}>
            <Typography noWrap>{track.name}</Typography>
            <Typography noWrap color="textSecondary" variant="body2">
              {track.artists.map((artist) => artist.name).join(', ')}
            </Typography>
          </div>
          {onRemove && (
            <div className={styles.itemAction}>
              <IconButton
                aria-label="delete"
                onClick={() => onRemove(index)}
                className={styles.iconButton}
              >
                <RemoveCircleIcon color="error" fontSize="small" />
              </IconButton>
            </div>
          )}
        </div>
      ))}
      {onRemove && (
        <div className={styles.buttonContainer}>
          <Button onClick={clearQueue}>Clear</Button>
        </div>
      )}
    </>
  );
};

export default QueueList;
