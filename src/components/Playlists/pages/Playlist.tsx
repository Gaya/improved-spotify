import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

import { playlistQuery } from '../../../state/selectors';

import Layout from '../../App/Layout';
import PageContainer from '../../App/PageContainer';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';
import Container from '../../Container/Container';

import Image from '../components/Image';
import PlaylistInfo from '../components/PlaylistInfo';
import TrackList from '../components/TrackList';
import { PlaylistView } from '../../../types';
import { getStoredPlaylistView, storePlaylistView } from '../utils';

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
  viewContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
  },
}));

type PlaylistProps = RouteComponentProps<{ id: string }>;

const Playlist: React.FC<PlaylistProps> = ({ match }: PlaylistProps) => {
  const { id } = match.params;

  const theme = useTheme();
  const styles = useStyles(theme);
  const playlist = useRecoilValueLoadable(playlistQuery(id));

  const [viewAs, setViewAs] = useState<PlaylistView>(getStoredPlaylistView());

  const onSelectView = (viewType: PlaylistView): void => {
    setViewAs(viewType);
    storePlaylistView(viewType);
  };

  return (
    <Layout>
      <PageContainer>
        {playlist.state !== 'hasValue' && <Container><LoadingIndicator /></Container>}
        {playlist.state === 'hasValue' && playlist.contents && (
          <>
            <Container>
              <section className={styles.topBar}>
                <div className={styles.topBarImage}>
                  <Image key={`Image_${id}`} id={id} />
                </div>
                <PlaylistInfo playlist={playlist.contents} />
              </section>
            </Container>
            <Container className={styles.viewContainer}>
              <ButtonGroup size="small">
                <Button
                  variant={viewAs === PlaylistView.ALBUM ? 'contained' : 'outlined'}
                  onClick={(): void => onSelectView(PlaylistView.ALBUM)}
                >
                  Albums
                </Button>
                <Button
                  variant={viewAs === PlaylistView.PLAYLIST ? 'contained' : 'outlined'}
                  onClick={(): void => onSelectView(PlaylistView.PLAYLIST)}
                >
                  Playlist
                </Button>
              </ButtonGroup>
            </Container>
            <TrackList viewAs={viewAs} key={`TrackList_${id}`} id={id} />
          </>
        )}
      </PageContainer>
    </Layout>
  );
};

export default Playlist;
