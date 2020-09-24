import React from 'react';
import Container from '@material-ui/core/Container';
import { RouteComponentProps } from 'react-router-dom';

import PageTitle from '../../PageTitle/PageTitle';
import Layout from '../../App/Layout';

type PlaylistProps = RouteComponentProps<{ id: string }>;

const Playlist: React.FC<PlaylistProps> = ({ match }: PlaylistProps) => {
  const test = 1;

  return (
    <Layout>
      <Container>
        <PageTitle>
          Playlist
          {' '}
          {match.params.id}
        </PageTitle>
      </Container>
    </Layout>
  );
};

export default Playlist;
