import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

import useTrackInfo from './hooks/useTrackInfo';
import formatDuration from '../../utils/formatDuration';

interface CompactTrackProps {
  id: string;
  style: React.CSSProperties;
}

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 0,
    width: '45%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    paddingRight: 4,
  },
  artist: {
    flexGrow: 0,
    width: '25%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    paddingRight: 4,
  },
  album: {
    flexShrink: 0,
    width: '25%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    paddingRight: 4,
  },
  duration: {
    flexShrink: 0,
    width: '5%',
    minWidth: 65,
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  track: {
    height: 36,
    display: 'flex',
    borderBottomColor: theme.palette.divider,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    alignItems: 'center',
  },
}));

const CompactTrack: React.FC<CompactTrackProps> = ({ style, id }: CompactTrackProps) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const track = useTrackInfo(id);

  if (track.state === 'loading' || track.state === 'hasError') {
    return (
      <div key={id} className={styles.track} style={style} />
    );
  }

  return (
    <div key={id} className={styles.track} style={style}>
      <div className={styles.title}>{track.contents.name}</div>
      <div className={styles.artist}>{track.contents.artists.join(', ')}</div>
      <div className={styles.album}>{track.contents.album}</div>
      <div className={styles.duration}>{formatDuration(track.contents.duration_ms)}</div>
    </div>
  );
};

export default CompactTrack;
