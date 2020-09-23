import React from 'react';

import Container from '@material-ui/core/Container';

import Layout from '../../components/App/Layout';
import PageTitle from '../../components/PageTitle/PageTitle';

const Default: React.FC = () => (
  <Layout>
    <Container>
      <PageTitle>
        Browse Your Playlists
      </PageTitle>
    </Container>
  </Layout>
);

export default Default;
