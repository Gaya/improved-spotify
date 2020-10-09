import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';

import PlaylistTrackList from '../../Tracklist/components/PlaylistTrackList';
import AlbumList from '../../Tracklist/components/AlbumListContainer';
import Container from '../../Container/Container';

import { PlaylistView, StoredSpotifyPlaylistTrack } from '../../../types';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    flexDirection: 'column',
    overflowY: 'hidden',
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

interface TrackListProps {
  progress: number;
  tracks: StoredSpotifyPlaylistTrack[];
  isResolved: boolean;
  showProgress: boolean;
  viewAs: PlaylistView;
}

const TrackList: React.FC<TrackListProps> = ({
  showProgress,
  isResolved,
  progress,
  tracks,
  viewAs,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <div className={styles.container}>
      {showProgress && !isResolved && (
        <Container>
          <LinearProgress className={styles.progress} variant="determinate" value={progress} />
        </Container>
      )}
      {isResolved && tracks && viewAs === PlaylistView.PLAYLIST
        && <PlaylistTrackList tracks={tracks} />}
      {isResolved && tracks && viewAs === PlaylistView.ALBUM
        && <AlbumList tracks={tracks} />}
    </div>
  );
};

export default TrackList;
