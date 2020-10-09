import React, { useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getCurrentPlaying } from '../../utils/externalData';
import { SpotifyCurrentTrack } from '../../types';
import formatDuration from '../../utils/formatDuration';

const useStyles = makeStyles((theme) => ({
  player: {
    display: 'flex',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 196,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(3),
  },
  currentlyPlaying: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(6),
  },
  songName: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  progress: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progressBar: {
    flexGrow: 1,
    marginBottom: -2,
  },
  progressStart: {
    width: 60,
    flexShrink: 0,
    marginTop: -5,
  },
  progressEnd: {
    width: 60,
    flexShrink: 0,
    textAlign: 'right',
    marginTop: -5,
  },
}));

const Player: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<SpotifyCurrentTrack>();

  const isPlaying = !!(currentlyPlaying && currentlyPlaying.is_playing);

  const fetchCurrentlyPlaying = (): Promise<void> => getCurrentPlaying().then(setCurrentlyPlaying);

  useEffect(() => {
    const refreshData = setInterval(fetchCurrentlyPlaying, 1000);
    fetchCurrentlyPlaying();

    return (): void => clearInterval(refreshData);
  }, []);

  return (
    <div className={styles.player}>
      <div className={styles.controls}>
        <IconButton>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton>
          <SkipNextIcon />
        </IconButton>
      </div>
      {currentlyPlaying && (
        <div className={styles.currentlyPlaying}>
          <div className={styles.songName}>
            <Typography>{currentlyPlaying.item.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {currentlyPlaying.item.artists.map((artist) => artist.name).join(', ')}
            </Typography>
          </div>
          <div className={styles.progress}>
            <Typography className={styles.progressStart} variant="body2" color="textSecondary">
              {formatDuration(currentlyPlaying.progress_ms)}
            </Typography>
            <LinearProgress
              className={styles.progressBar}
              variant="determinate"
              value={100 / (currentlyPlaying.item.duration_ms / currentlyPlaying.progress_ms)}
            />
            <Typography className={styles.progressEnd} variant="body2" color="textSecondary">
              {formatDuration(currentlyPlaying.item.duration_ms)}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
