import React from 'react';
import { Link } from '@material-ui/core';

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
    <Link href={authUrl}>Authenticate with Spotify</Link>
  );
};

export default AuthButton;
