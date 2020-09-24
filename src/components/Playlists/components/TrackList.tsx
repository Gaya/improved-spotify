import React, { useEffect, useRef, useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import LinearProgress from '@material-ui/core/LinearProgress';

import { PagedResponse, SpotifyTrack } from '../../../types';
import { SPOTIFY_PLAYLIST_TRACKS } from '../../../consts';
import { get } from '../../../utils/authRequest';

interface TrackListProps {
  id: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
  },
}));

function useTrackList(id: string): {
  totalTracks: number;
  progress: number;
  tracks: SpotifyTrack[];
} {
  const [isFetching, setIsFetching] = useState(false);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const nextRef = useRef(SPOTIFY_PLAYLIST_TRACKS.replace('{id}', id));

  useEffect(() => {
    if (!isFetching) {
      setIsFetching(true);

      get<PagedResponse<SpotifyTrack>>(nextRef.current).then((response) => {
        setTracks([...tracks, ...response.items]);
        setTotalTracks(response.total);

        if (response.next) {
          nextRef.current = response.next;
          setIsFetching(false);
        }
      });
    }
  }, [id, isFetching, tracks]);

  return {
    tracks,
    progress: (tracks.length / totalTracks) * 100,
    totalTracks,
  };
}

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
