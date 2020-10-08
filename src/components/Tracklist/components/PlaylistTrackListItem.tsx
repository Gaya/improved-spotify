import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

import formatDuration from '../../../utils/formatDuration';
import { StoredSpotifyPlaylistTrack } from '../../../types';

import useTrackInfo from '../hooks/useTrackInfo';
import AlbumLink from './AlbumLink';
import ArtistLink from './ArtistLink';

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

interface PlaylistTrackListItem {
  playlistTrack: StoredSpotifyPlaylistTrack;
  style: React.CSSProperties;
}

const PlaylistTrackListItem: React.FC<PlaylistTrackListItem> = ({ style, playlistTrack }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { track: id } = playlistTrack;
  const track = useTrackInfo(id);

  if (track.state !== 'hasValue') {
    return (
      <div key={id} className={styles.track} style={style} />
    );
  }

  return (
    <div key={id} className={styles.track} style={style}>
      <div className={styles.title}>{track.contents.name}</div>
      <div className={styles.artist}>
        {track.contents.artists.map((artist) => <ArtistLink key={artist} id={artist} />)}
      </div>
      <div className={styles.album}><AlbumLink id={track.contents.album} /></div>
      <div className={styles.duration}>{formatDuration(track.contents.duration_ms)}</div>
    </div>
  );
};

export default PlaylistTrackListItem;
