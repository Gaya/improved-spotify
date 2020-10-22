import React from 'react';
import { Link } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Layout from '../../App/Layout';
import PageTitle from '../../PageTitle/PageTitle';
import PageContainer from '../../App/PageContainer';
import Container from '../../Container/Container';
import CenteredContainer from '../../CenteredContainer/CenteredContainer';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';

import usePlaylists from '../hooks/usePlaylists';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflowY: 'hidden',
  },
  playlistImage: {
    width: 260,
    height: 260,
    backgroundSize: 'cover',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: theme.palette.background.paper,
    borderColor: '#010102',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
    marginBottom: theme.spacing(1),
  },
  playlistContainer: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    columnGap: `${theme.spacing(2)}px`,
    rowGap: `${theme.spacing(4)}px`,
    overflowY: 'scroll',
  },
  playlistItem: {
    width: 260 + theme.spacing(2),
    display: 'block',
  },
  playlistName: {
    textTransform: 'none',
  },
}));

const Browse: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const playlists = usePlaylists();

  return (
    <Layout>
      <PageContainer topPadding>
        <Container className={styles.container}>
          <PageTitle>
            Browse Your Playlists
          </PageTitle>

          {playlists.state !== 'hasValue' && <CenteredContainer><LoadingIndicator /></CenteredContainer>}
          {playlists.state === 'hasValue' && (
            <div className={styles.playlistContainer}>
              {playlists.contents.map((playlist) => (
                <Button
                  to={`/playlist/${playlist.id}`}
                  component={Link}
                  className={styles.playlistItem}
                  key={playlist.id}
                >
                  <div
                    className={styles.playlistImage}
                    style={{ backgroundImage: `url(${playlist.images[0].url})` }}
                  />
                  <Typography className={styles.playlistName} noWrap>{playlist.name}</Typography>
                </Button>
              ))}
            </div>
          )}
        </Container>
      </PageContainer>
    </Layout>
  );
};

export default Browse;
