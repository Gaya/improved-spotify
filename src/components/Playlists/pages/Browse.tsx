import React from 'react';

import Layout from '../../App/Layout';
import PageTitle from '../../PageTitle/PageTitle';
import PageContainer from '../../App/PageContainer';
import Container from '../../Container/Container';

const Browse: React.FC = () => (
  <Layout>
    <PageContainer>
      <Container>
        <PageTitle>
          Browse Your Playlists
        </PageTitle>
      </Container>
    </PageContainer>
  </Layout>
);

export default Browse;
