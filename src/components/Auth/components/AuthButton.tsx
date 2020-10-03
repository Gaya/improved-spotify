import React from 'react';

import Button from '@material-ui/core/Button';

import { createAuthUrl } from '../utils';
import useAuthStrings from '../hooks/useAuthStrings';

import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';

const AuthButton: React.FC = () => {
  const { codeChallenge, state, isLoading } = useAuthStrings();

  if (isLoading) {
    return (
      <LoadingIndicator />
    );
  }

  const authUrl = createAuthUrl(codeChallenge, state);

  return (
    <Button href={authUrl} variant="outlined" size="large" color="primary">
      Authenticate with Spotify
    </Button>
  );
};

export default AuthButton;
