import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { StoredSpotifyPlaylistTrack } from '../../../types';
import useArtistsFromTracks from '../hooks/useArtistsFromTracks';

const useStyles = makeStyles({
  container: {
    width: 220,
    flexShrink: 0,
    borderRightStyle: 'solid',
    borderRightWidth: 2,
    borderRightColor: '#010102',
    overflowY: 'scroll',
  },
});

interface ArtistsListProps {
  tracks: StoredSpotifyPlaylistTrack[];
  selected?: string;
  setSelected: (id: string) => void;
}

const ArtistsList: React.FC<ArtistsListProps> = ({ tracks, setSelected, selected }) => {
  const styles = useStyles();
  const artists = useArtistsFromTracks(tracks);

  return (
    <div className={styles.container}>
      <List>
        {artists.state === 'hasValue' && artists.contents.map((artist) => (
          <ListItem
            key={artist.id}
            selected={selected === artist.id}
            button
            onClick={(): void => setSelected(artist.id)}
          >
            <ListItemText>{artist.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ArtistsList;
