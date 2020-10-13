import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';

import PlaylistTrackList from './PlaylistTrackList';
import AlbumList from './AlbumList';
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
  selectedArtist?: string;
}

const TrackList: React.FC<TrackListProps> = ({
  showProgress,
  isResolved,
  progress,
  tracks,
  viewAs,
  selectedArtist,
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
        && <PlaylistTrackList key={`playlist_${viewAs}`} tracks={tracks} />}
      {isResolved && tracks && (viewAs === PlaylistView.ALBUM || viewAs === PlaylistView.ARTIST)
        && <AlbumList key={`albums_${viewAs}`} selectedArtist={selectedArtist} tracks={tracks} />}
    </div>
  );
};

export default TrackList;
