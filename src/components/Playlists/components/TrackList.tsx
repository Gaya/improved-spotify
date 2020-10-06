import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';

import useTrackList from '../hooks/useTrackList';
import CompactTrackList from '../../Tracklist/CompactTrackList';

interface TrackListProps {
  id: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    paddingTop: theme.spacing(3),
  },
  listContainer: {
    display: 'flex',
    flexGrow: 1,
  },
  progress: {
    width: '100%',
  },
}));

const TrackList: React.FC<TrackListProps> = ({ id }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const {
    progress,
    tracks,
    showProgress,
    isResolved,
  } = useTrackList(id);

  return (
    <div className={styles.container}>
      {showProgress && !isResolved && <LinearProgress className={styles.progress} variant="determinate" value={progress} />}
      {isResolved && tracks && <CompactTrackList tracks={tracks} />}
    </div>
  );
};

export default TrackList;
