import React, { useState, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

import { StoredSpotifyPlaylistTrack } from '../../types';
import CompactTrack from './CompactTrack';

interface TrackListProps {
  tracks: StoredSpotifyPlaylistTrack[];
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  topBar: {
    display: 'flex',
    height: 30,
    flexGrow: 0,
    flexShrink: 0,
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
    borderBottomColor: theme.palette.divider,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },
  topBarTitle: {
    flexGrow: 0,
    width: '45%',
    paddingRight: 4,
  },
  topBarArtist: {
    flexGrow: 0,
    width: '25%',
    paddingRight: 4,
  },
  topBarAlbum: {
    flexShrink: 0,
    width: '25%',
    paddingRight: 4,
  },
  topBarDuration: {
    flexShrink: 0,
    width: '5%',
    minWidth: 65,
    textAlign: 'right',
  },
  listContainer: {
    display: 'flex',
    flexGrow: 1,
  },
}));

const CompactTrackList: React.FC<TrackListProps> = ({ tracks }) => {
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
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.topBarTitle}>Title</div>
        <div className={styles.topBarArtist}>Artist</div>
        <div className={styles.topBarAlbum}>Album</div>
        <div className={styles.topBarDuration}>Time</div>
      </div>
      <div className={styles.listContainer} ref={containerRef}>
        <List height={height} itemCount={tracks.length} itemSize={36} width="100%">
          {({ index, style }): React.ReactElement => (
            <CompactTrack id={tracks[index].track} style={style} />
          )}
        </List>
      </div>
    </div>
  );
};

export default CompactTrackList;
