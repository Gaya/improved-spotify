import { FC, useContext } from 'react';

import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import formatDuration from '../../utils/formatDuration';

import PlayerContext from './context';

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
    marginBottom: -16,
  },
  progressStart: {
    width: 60,
    flexShrink: 0,
    marginTop: -5,
    paddingRight: theme.spacing(2),
    textAlign: 'right',
  },
  progressEnd: {
    width: 60,
    flexShrink: 0,
    paddingLeft: theme.spacing(2),
    marginTop: -5,
  },
}));

const Player: FC = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { playbackState, actions } = useContext(PlayerContext);
  const {
    next,
    pause,
    previous,
    resume,
    seek,
  } = actions;

  const isPlaying = !playbackState.paused;
  const currentTrack = playbackState.current;

  return (
    <div className={styles.player}>
      <div className={styles.controls}>
        <IconButton onClick={(): void => { previous(); }}>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton
          onClick={(): void => {
            if (isPlaying) {
              pause();
            } else {
              resume();
            }
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={(): void => { next(); }}>
          <SkipNextIcon />
        </IconButton>
      </div>
      {currentTrack && (
        <div className={styles.currentlyPlaying}>
          <div className={styles.songName}>
            <Typography>{currentTrack.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {currentTrack.artists.map((artist) => artist.name).join(', ')}
            </Typography>
          </div>
          <div className={styles.progress}>
            <Typography className={styles.progressStart} variant="body2" color="textSecondary">
              {formatDuration(playbackState.position)}
            </Typography>
            <Slider
              className={styles.progressBar}
              min={0}
              max={100}
              value={100 / (currentTrack.duration_ms / playbackState.position)}
              onChange={(_, value: number | number[]) => {
                if (Array.isArray(value)) {
                  return;
                }

                const seekTo = currentTrack.duration_ms * (value / 100);
                seek(seekTo);
              }}
            />
            {/* <LinearProgress */}
            {/*  className={styles.progressBar} */}
            {/*  variant="determinate" */}
            {/*  value={100 / (currentTrack.duration_ms / playbackState.position)} */}
            {/* /> */}
            <Typography className={styles.progressEnd} variant="body2" color="textSecondary">
              {formatDuration(currentTrack.duration_ms)}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
