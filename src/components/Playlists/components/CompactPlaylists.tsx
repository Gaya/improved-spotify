import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';

import { playlistsQuery } from '../../../state/selectors';

const StyledListItemIcon = styled(ListItemIcon)`
  min-width: 26px;
`;

const CompactPlaylists: React.FC = () => {
  const { id } = useParams();
  const playlists = useRecoilValueLoadable(playlistsQuery);

  return (
    <List subheader={<ListSubheader disableSticky>Playlists</ListSubheader>}>
      {playlists.state !== 'hasValue' && (
        <ListItem>
          <StyledListItemIcon>
            <LoadingIndicator size={16} />
          </StyledListItemIcon>
          <ListItemText secondary="Loading playlists" />
        </ListItem>
      )}
      {playlists.state === 'hasValue' && playlists.contents.map(
        (playlist) => (
          <ListItem
            key={playlist.id}
            button
            to={`/playlist/${playlist.id}`}
            component={Link}
            selected={playlist.id === id}
          >
            {playlist.name}
          </ListItem>
        ),
      )}
    </List>
  );
};

export default CompactPlaylists;
