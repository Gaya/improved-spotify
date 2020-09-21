import React, { useContext } from 'react';
import { Button } from '@material-ui/core';

import AuthButton from '../../utils/Auth/components/AuthButton';
import AuthContext from '../../utils/Auth/context';
import { SPOTIFY_PLAYLISTS_URI } from '../../consts';
import { get } from '../../utils/authRequest';

import Layout from '../../components/App/Layout';

const Default: React.FC = () => {
  const { isLoggedIn, logOut } = useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <div>
        <AuthButton />
      </div>
    );
  }

  return (
    <Layout>
      <h1>Welcome!</h1>
      <div>
        <Button color="secondary" variant="contained" onClick={logOut}>Logout</Button>
      </div>
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
};

export default Default;
