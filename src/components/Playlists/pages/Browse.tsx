import React from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import Layout from '../../App/Layout';
import PageTitle from '../../PageTitle/PageTitle';
import PageContainer from '../../App/PageContainer';
import Container from '../../Container/Container';

import usePlaylists from '../hooks/usePlaylists';

const useStyles = makeStyles((theme) => ({
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
    marginTop: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: `${theme.spacing(2)}px`,
    overflowY: 'scroll',
  },
  playlistItem: {
    width: 260,
  },
}));

const Browse: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const playlists = usePlaylists();

  return (
    <Layout>
      <PageContainer topPadding>
        <Container>
          <PageTitle>
            Browse Your Playlists
          </PageTitle>

          {playlists.state === 'hasValue' && (
            <div className={styles.playlistContainer}>
              {playlists.contents.map((playlist) => (
                <div className={styles.playlistItem} key={playlist.id}>
                  <div
                    className={styles.playlistImage}
                    style={{ backgroundImage: `url(${playlist.images[0].url})` }}
                  />
                  <Typography noWrap>{playlist.name}</Typography>
                </div>
              ))}
            </div>
          )}
        </Container>
      </PageContainer>
    </Layout>
  );
};

export default Browse;
