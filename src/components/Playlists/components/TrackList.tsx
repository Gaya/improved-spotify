import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';

import useTrackList from '../hooks/useTrackList';

interface TrackListProps {
  id: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
  },
}));

const TrackList: React.FC<TrackListProps> = ({ id }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const { progress, tracks } = useTrackList(id);

  return (
    <div className={styles.container}>
      {progress < 100 && <LinearProgress variant="determinate" value={progress} />}
      {progress === 100 && (
        <div>Tracks loaded</div>
      )}
    </div>
  );
};

export default TrackList;
