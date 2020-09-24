import React from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import { SpotifyPlaylist } from '../../../types';
import htmlDecode from '../../../utils/htmlDecode';

const useStyles = makeStyles((theme) => ({
  infoContainer: {
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
    paddingBottom: theme.spacing(1),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
  subtitle: {
    paddingBottom: theme.spacing(1),
  },
}));

interface PlaylistInfoProps {
  playlist: SpotifyPlaylist;
}

const PlaylistInfo: React.FC<PlaylistInfoProps> = ({ playlist }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <div className={styles.infoContainer}>
      <Typography className={styles.title} variant="h4">
        {htmlDecode(playlist.name)}
      </Typography>
      {playlist.description && (
        <Typography className={styles.title} variant="body1" color="textSecondary">
          {htmlDecode(playlist.description)}
        </Typography>
      )}
      <Typography className={styles.subtitle} variant="body2" color="textSecondary">
        {`Created by ${playlist.owner.display_name}, ${playlist.tracks.total} songs`}
      </Typography>
    </div>
  );
};

export default PlaylistInfo;
