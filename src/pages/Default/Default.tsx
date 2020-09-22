import React from 'react';
import { Button } from '@material-ui/core';

import { SPOTIFY_PLAYLISTS_URI } from '../../consts';
import { get } from '../../utils/authRequest';

import Layout from '../../components/App/Layout';

const Default: React.FC = () => (
  <Layout>
    <h1>Welcome!</h1>
    <div>
      <Button
        onClick={(): void => {
          get(SPOTIFY_PLAYLISTS_URI).then(console.log).catch(console.error);
        }}
      >
        Get Playlists
      </Button>
    </div>
  </Layout>
);

export default Default;
