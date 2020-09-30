import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { playlistQuery } from '../../../state/selectors';

import Layout from '../../App/Layout';
import PageContainer from '../../App/PageContainer';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';

import Image from '../components/Image';
import PlaylistInfo from '../components/PlaylistInfo';
import TrackList from '../components/TrackList';

const useStyles = makeStyles((theme) => ({
  topBar: {
    display: 'flex',
    flexShrink: 0,
    flexGrow: 0,
  },
  topBarImage: {
    flexShrink: 0,
    paddingRight: theme.spacing(3),
  },
}));

type PlaylistProps = RouteComponentProps<{ id: string }>;

const Playlist: React.FC<PlaylistProps> = ({ match }: PlaylistProps) => {
  const { id } = match.params;

  const theme = useTheme();
  const styles = useStyles(theme);
  const playlist = useRecoilValueLoadable(playlistQuery(id));

  return (
    <Layout>
      <PageContainer>
        {playlist.state !== 'hasValue' && <LoadingIndicator />}
        {playlist.state === 'hasValue' && playlist.contents && (
          <>
            <section className={styles.topBar}>
              <div className={styles.topBarImage}>
                <Image key={`Image_${id}`} id={id} />
              </div>
              <PlaylistInfo playlist={playlist.contents} />
            </section>
            <TrackList key={`TrackList_${id}`} id={id} />
          </>
        )}
      </PageContainer>
    </Layout>
  );
};

export default Playlist;
