import React, { useContext } from 'react';
import { Button } from '@material-ui/core';

import AuthButton from '../../utils/Auth/components/AuthButton';
import AuthContext from '../../utils/Auth/context';
import { SPOTIFY_PLAYLISTS_URI } from '../../consts';
import { authGet } from '../../utils/authRequest';

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
    <div>
      <h1>Welcome!</h1>
      <div>
        <Button color="secondary" variant="contained" onClick={logOut}>Logout</Button>
      </div>
      <div>
        <Button
          onClick={(): void => {
            authGet(SPOTIFY_PLAYLISTS_URI).then(console.log).catch(console.error);
          }}
        >
          Get Playlists
        </Button>
      </div>
    </div>
  );
};

export default Default;
