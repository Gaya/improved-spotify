import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

import useTrackList from '../hooks/useTrackList';
import { getStoredPlaylistView, storePlaylistView } from '../utils';

import PlaylistTrackList from '../../Tracklist/components/PlaylistTrackList';
import AlbumList from '../../Tracklist/components/AlbumListContainer';

import { PlaylistView } from '../../../types';

interface TrackListProps {
  id: string;
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
  const [viewAs, setViewAs] = useState<PlaylistView>(getStoredPlaylistView());

  const onSelectView = (viewType: PlaylistView): void => {
    setViewAs(viewType);
    storePlaylistView(viewType);
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
      {isResolved && (
        <div className={styles.viewContainer}>
          <ButtonGroup size="small">
            <Button
              variant={viewAs === PlaylistView.PLAYLIST ? 'contained' : 'outlined'}
              onClick={(): void => onSelectView(PlaylistView.PLAYLIST)}
            >
              Playlist
            </Button>
            <Button
              variant={viewAs === PlaylistView.ALBUM ? 'contained' : 'outlined'}
              onClick={(): void => onSelectView(PlaylistView.ALBUM)}
            >
              Albums
            </Button>
          </ButtonGroup>
        </div>
      )}
      {isResolved && tracks && viewAs === PlaylistView.PLAYLIST
        && <PlaylistTrackList tracks={tracks} />}
      {isResolved && tracks && viewAs === PlaylistView.ALBUM
        && <AlbumList tracks={tracks} />}
    </div>
  );
};

export default TrackList;
