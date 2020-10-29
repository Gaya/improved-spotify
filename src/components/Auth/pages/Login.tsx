import React from 'react';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import makeStyles from '@material-ui/core/styles/makeStyles';

import AuthButton from '../components/AuthButton';
import CenteredContainer from '../../CenteredContainer/CenteredContainer';

const useStyles = makeStyles({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  subHeader: {
    marginBottom: 32,
  },
});

const Login: React.FC = () => {
  const styles = useStyles();

  return (
    <CenteredContainer>
      <Card variant="outlined">
        <CardContent className={styles.container}>
          <Typography variant="h1" gutterBottom>Spotify Revised</Typography>
          <Typography variant="h6" className={styles.subHeader} color="textSecondary">
            An improved browsing experience for your Spotify playlists.
          </Typography>
          <AuthButton />
        </CardContent>
      </Card>
    </CenteredContainer>
  );
};

export default Login;
