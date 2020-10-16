import React from 'react';
import { useRecoilValue } from 'recoil';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';

import { PlaylistView, StoredSpotifyPlaylistTrack } from '../../../types';
import { playlistViewAs } from '../../../state/atoms';

import Container from '../../Container/Container';

import PlaylistTrackList from './PlaylistTrackList';
import AlbumList from './AlbumList';

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
}

const TrackList: React.FC<TrackListProps> = ({
  showProgress,
  isResolved,
  progress,
  tracks,
}) => {
  const viewAs = useRecoilValue(playlistViewAs);

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
        && <PlaylistTrackList key={`playlist_${viewAs}`} tracks={tracks} />}
      {isResolved && tracks && (viewAs === PlaylistView.ALBUM || viewAs === PlaylistView.ARTIST)
        && <AlbumList key={`albums_${viewAs}`} tracks={tracks} />}
    </div>
  );
};

export default TrackList;
