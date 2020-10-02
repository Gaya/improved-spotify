import React, { useState, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';

import useTrackList from '../hooks/useTrackList';
import { info } from '../../../utils/logging';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const {
    progress,
    tracks,
    showProgress,
    isResolved,
  } = useTrackList(id);

  useEffect(() => {
    function handleWindowResize(): void {
      if (containerRef.current) {
        const boundingBox = containerRef.current.getBoundingClientRect();
        setHeight(boundingBox.height);
      }
    }

    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();

    return (): void => window.removeEventListener('resize', handleWindowResize);
  }, [theme, isResolved]);

  return (
    <div className={styles.container}>
      {showProgress && !isResolved && <LinearProgress className={styles.progress} variant="determinate" value={progress} />}
      {isResolved && tracks && (
        <div className={styles.listContainer} ref={containerRef}>
          <List height={height} itemCount={tracks.length} itemSize={30} width="100%">
            {({ index, style }): React.ReactElement => (
              <div style={style}>{tracks[index].track}</div>
            )}
          </List>
        </div>
      )}
    </div>
  );
};

export default TrackList;
