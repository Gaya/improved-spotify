import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  empty: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
  },
}));

interface QueueListProps {
  emptyText: string;
  tracks: SpotifyAlbumTrack[];
}

const QueueList: React.FC<QueueListProps> = ({ emptyText, tracks }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  if (tracks.length === 0) {
    return <div className={styles.empty}>{emptyText}</div>;
  }

  return (
    <div>
      Tracks
    </div>
  );
};

export default QueueList;
