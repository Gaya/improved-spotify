import React from 'react';

import { createAuthStrings } from '../utils';

import { urlWithQueryString } from '../../request';

import { APP_URI, SPOTIFY_AUTH_URI, SPOTIFY_CLIENT_ID } from '../../../consts';

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
  const { codeChallenge, codeVerifier, state } = createAuthStrings();

  const authUrl = urlWithQueryString(
    SPOTIFY_AUTH_URI,
    {
      /* eslint-disable @typescript-eslint/camelcase */
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: `${APP_URI}/auth`,
      code_challenge_method: 'S256',
      code_verifier: codeVerifier,
      code_challenge: codeChallenge,
      state,
      scope,
      /* eslint-enable @typescript-eslint/camelcase */
    },
  );

  return (
    <a href={authUrl}>Authenticate with Spotify</a>
  );
};

export default AuthButton;
