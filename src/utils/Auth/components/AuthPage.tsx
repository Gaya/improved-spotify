import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import ReplayIcon from '@material-ui/icons/Replay';

import { getStoredCodeVerifier, getStoredState, wipeAuthStorage } from '../utils';

import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_TOKEN_URI } from '../../../consts';

import FullScreenIndicator from '../../../components/LoadingIndicator/FullScreenIndicator';
import CenteredContainer from '../../../components/CenteredContainer/CenteredContainer';

const AuthPage: React.FC = () => {
  const history = useHistory();
  const searchParams = new URLSearchParams(window.location.search);
  const storedState = getStoredState();

  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const code = searchParams.get('code');

  useEffect(() => {
    const codeVerifier = getStoredCodeVerifier() || '';

    const body = new URLSearchParams();
    body.set('client_id', SPOTIFY_CLIENT_ID);
    body.set('grant_type', 'authorization_code');
    body.set('code', code || '');
    body.set('redirect_uri', SPOTIFY_REDIRECT_URI);
    body.set('code_verifier', codeVerifier);

    fetch(
      SPOTIFY_TOKEN_URI,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      },
    ).then((response) => {
      console.log(response);
    }).catch((err) => {
      console.error(err);
    });
  }, [code]);

  if (storedState !== state || error) {
    wipeAuthStorage();

    return (
      <CenteredContainer fullScreen>
        <Card variant="outlined">
          <CardHeader
            disableTypography
            avatar={<ErrorIcon style={{ color: red[500] }} fontSize="large" />}
            title={<Typography variant="h5">Authentication Failed</Typography>}
          />
          <CardContent>
            Whoops! Looks like authenticating with Spotify failed.
          </CardContent>
          <CardContent>
            <Button
              onClick={(): void => history.push('/')}
              startIcon={<ReplayIcon />}
              variant="contained"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </CenteredContainer>
    );
  }

  return (
    <FullScreenIndicator />
  );
};

export default AuthPage;
