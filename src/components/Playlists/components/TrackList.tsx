import React, { useState, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';

import useTrackList from '../hooks/useTrackList';

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
}));

const TrackList: React.FC<TrackListProps> = ({ id }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

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
  }, [theme]);

  const { progress, tracks } = useTrackList(id);

  return (
    <div className={styles.container}>
      {progress < 100 && <LinearProgress variant="determinate" value={progress} />}
      {progress === 100 && tracks && (
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
