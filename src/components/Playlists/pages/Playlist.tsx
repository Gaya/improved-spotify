import React from 'react';
import Container from '@material-ui/core/Container';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import Box from '@material-ui/core/Box';

import PageTitle from '../../PageTitle/PageTitle';
import Layout from '../../App/Layout';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';

import { playlistQuery } from '../../../state/selectors';

type PlaylistProps = RouteComponentProps<{ id: string }>;

const Playlist: React.FC<PlaylistProps> = ({ match }: PlaylistProps) => {
  const playlist = useRecoilValueLoadable(playlistQuery(match.params.id));

  console.log(playlist);

  return (
    <Layout>
      <Container>
        {playlist.state !== 'hasValue' && <Box marginTop={3}><LoadingIndicator /></Box>}
        {playlist.state === 'hasValue' && playlist.contents && (
          <PageTitle title={playlist.contents.name} subtitle={playlist.contents.description} />
        )}
      </Container>
    </Layout>
  );
};

export default Playlist;
