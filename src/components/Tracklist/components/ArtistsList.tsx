import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import useTheme from '@material-ui/core/styles/useTheme';

import { StoredSpotifyPlaylistTrack } from '../../../types';
import useArtistsFromTracks from '../hooks/useArtistsFromTracks';

const useStyles = makeStyles((theme) => ({
  container: {
    width: 220,
    flexShrink: 0,
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: theme.palette.divider,
    overflowY: 'scroll',
  },
}));

interface ArtistsListProps {
  tracks: StoredSpotifyPlaylistTrack[];
  selected?: string;
  setSelected: (id: string) => void;
  resetSelectedArtist: () => void;
}

const ArtistsList: React.FC<ArtistsListProps> = ({
  tracks,
  setSelected,
  resetSelectedArtist,
  selected,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const artists = useArtistsFromTracks(tracks);

  return (
    <div className={styles.container}>
      <List>
        {artists.map((artist) => (
          <ListItem
            key={artist.id}
            selected={selected === artist.id}
            button
            onClick={(): void => (selected === artist.id
              ? resetSelectedArtist()
              : setSelected(artist.id))}
          >
            <ListItemText>{artist.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ArtistsList;
