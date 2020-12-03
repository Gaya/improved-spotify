import { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { playlistQuery } from '../../../state/selectors';
import { playlistViewAs } from '../../../state/atoms';
import { PlaylistView } from '../../../enums';

import Layout from '../../App/Layout';
import PageContainer from '../../App/PageContainer';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';
import Container from '../../Container/Container';
import CenteredContainer from '../../CenteredContainer/CenteredContainer';
import TrackList from '../../Tracklist/components/TrackList';
import ArtistsList from '../../Tracklist/components/ArtistsList';

import Image from '../components/Image';
import PlaylistInfo from '../components/PlaylistInfo';
import useTrackList from '../hooks/useTrackList';
import ViewPicker from '../components/ViewPicker';
import Filter from '../components/Filter';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexGrow: 1,
    overflowY: 'hidden',
  },
  playlistContent: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflowY: 'hidden',
    paddingTop: theme.spacing(3),
  },
  topBar: {
    display: 'flex',
    flexShrink: 0,
    flexGrow: 0,
  },
  topBarImage: {
    flexShrink: 0,
    paddingRight: theme.spacing(3),
  },
  viewContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
  },
}));

type PlaylistProps = RouteComponentProps<{ id: string }>;

const Playlist: FC<PlaylistProps> = ({ match }: PlaylistProps) => {
  const { id } = match.params;

  const theme = useTheme();
  const styles = useStyles(theme);
  const playlist = useRecoilValueLoadable(playlistQuery(id));
  const viewAs = useRecoilValue(playlistViewAs);

  const {
    progress,
    showProgress,
    isResolved,
  } = useTrackList(id);

  return (
    <Layout>
      <PageContainer>
        {playlist.state !== 'hasValue' && <CenteredContainer><LoadingIndicator /></CenteredContainer>}
        {playlist.state === 'hasValue' && playlist.contents && (
          <div className={styles.container}>
            {viewAs === PlaylistView.ARTIST && (
              <ArtistsList />
            )}
            <div className={styles.playlistContent}>
              <Container>
                <section className={styles.topBar}>
                  <div className={styles.topBarImage}>
                    <Image key={`Image_${id}`} id={id} />
                  </div>
                  <PlaylistInfo playlist={playlist.contents} />
                </section>
              </Container>
              <Container className={styles.viewContainer}>
                <Filter />
                <ViewPicker />
              </Container>
              <TrackList
                progress={progress}
                showProgress={showProgress}
                isResolved={isResolved}
              />
            </div>
          </div>
        )}
      </PageContainer>
    </Layout>
  );
};

export default Playlist;
