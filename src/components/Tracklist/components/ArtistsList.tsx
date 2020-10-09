import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';

import { StoredSpotifyPlaylistTrack } from '../../../types';
import useArtistsFromTracks from '../hooks/useArtistsFromTracks';

const useStyles = makeStyles({
  container: {
    width: 150,
    borderRightStyle: 'solid',
    borderRightWidth: 2,
    borderRightColor: '#010102',
  },
});

interface ArtistsListProps {
  tracks: StoredSpotifyPlaylistTrack[];
}

const ArtistsList: React.FC<ArtistsListProps> = ({ tracks }) => {
  const styles = useStyles();
  const artists = useArtistsFromTracks(tracks);

  return (
    <div className={styles.container}>
      {artists.state === 'hasValue' && artists.contents.map((artist) => (
        <div key={artist.id}>{artist.name}</div>
      ))}
    </div>
  );
};

export default ArtistsList;
