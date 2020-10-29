import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import makeStyles from '@material-ui/core/styles/makeStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import useTheme from '@material-ui/core/styles/useTheme';

import { playlistSelectedArtist } from '../../../state/atoms';

import { artistsFromCurrentTracks } from '../../../state/selectors';

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

const ArtistsList: React.FC = () => {
  const [selected, setSelected] = useRecoilState(playlistSelectedArtist);
  const artists = useRecoilValue(artistsFromCurrentTracks);

  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <div className={styles.container}>
      <List>
        {artists.map((artist) => (
          <ListItem
            key={artist.id}
            selected={selected === artist.id}
            button
            onClick={(): void => (selected === artist.id
              ? setSelected(undefined)
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
