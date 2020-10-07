import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

import useTrackList from '../hooks/useTrackList';
import CompactTrackList from '../../Tracklist/components/CompactTrackList';
import AlbumTrackList from '../../Tracklist/components/AlbumTrackList';

interface TrackListProps {
  id: string;
}

enum ViewType {
  PLAYLIST = 'PLAYLIST',
  ALBUM = 'ALBUM',
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    flexDirection: 'column',
  },
  listContainer: {
    display: 'flex',
    flexGrow: 1,
  },
  progress: {
    width: '100%',
  },
  viewContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: theme.spacing(3),
  },
}));

const TrackList: React.FC<TrackListProps> = ({ id }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [viewAs, setViewAs] = useState<ViewType>(ViewType.PLAYLIST);

  const onSelectView = (viewType: ViewType): void => {
    setViewAs(viewType);
  };

  const {
    progress,
    tracks,
    showProgress,
    isResolved,
  } = useTrackList(id);

  return (
    <div className={styles.container}>
      {showProgress && !isResolved && <LinearProgress className={styles.progress} variant="determinate" value={progress} />}
      <div className={styles.viewContainer}>
        <ButtonGroup size="small">
          <Button
            variant={viewAs === ViewType.PLAYLIST ? 'contained' : 'outlined'}
            onClick={(): void => onSelectView(ViewType.PLAYLIST)}
          >
            Playlist
          </Button>
          <Button
            variant={viewAs === ViewType.ALBUM ? 'contained' : 'outlined'}
            onClick={(): void => onSelectView(ViewType.ALBUM)}
          >
            Albums
          </Button>
        </ButtonGroup>
      </div>
      {isResolved && tracks && viewAs === ViewType.PLAYLIST && <CompactTrackList tracks={tracks} />}
      {isResolved && tracks && viewAs === ViewType.ALBUM && <AlbumTrackList tracks={tracks} />}
    </div>
  );
};

export default TrackList;
