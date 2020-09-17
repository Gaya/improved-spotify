import React from 'react';
import { Link } from '@material-ui/core';

import useAuthStrings from '../hooks/useAuthStrings';

import { urlWithQueryString } from '../../request';

import { SPOTIFY_AUTH_URI, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../../../consts';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';

const scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
];
const scope = scopes.join(' ');

const AuthButton: React.FC = () => {
  const { codeChallenge, state, isLoading } = useAuthStrings();

  if (isLoading) {
    return (
      <LoadingIndicator />
    );
  }

  const authUrl = urlWithQueryString(
    SPOTIFY_AUTH_URI,
    {
      /* eslint-disable @typescript-eslint/camelcase */
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      state,
      scope,
      /* eslint-enable @typescript-eslint/camelcase */
    },
  );

  return (
    <Link href={authUrl}>Authenticate with Spotify</Link>
  );
};

export default AuthButton;
