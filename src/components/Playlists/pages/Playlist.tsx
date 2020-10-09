import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

import { playlistQuery } from '../../../state/selectors';
import { PlaylistView } from '../../../types';

import Layout from '../../App/Layout';
import PageContainer from '../../App/PageContainer';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';
import Container from '../../Container/Container';
import CenteredContainer from '../../CenteredContainer/CenteredContainer';
import TrackList from '../../Tracklist/components/TrackList';

import Image from '../components/Image';
import PlaylistInfo from '../components/PlaylistInfo';
import { getStoredPlaylistView, storePlaylistView } from '../utils';
import useTrackList from '../hooks/useTrackList';
import ArtistsList from '../../Tracklist/components/ArtistsList';

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
  const [selectedArtist, setSelectedArtist] = useState<string | undefined>();

  const onSelectView = (viewType: PlaylistView): void => {
    setViewAs(viewType);
    storePlaylistView(viewType);
  };

  const {
    progress,
    tracks,
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
              <ArtistsList
                tracks={tracks}
                selected={selectedArtist}
                setSelected={setSelectedArtist}
              />
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
                <ButtonGroup size="small">
                  <Button
                    variant={viewAs === PlaylistView.ALBUM ? 'contained' : 'outlined'}
                    onClick={(): void => onSelectView(PlaylistView.ALBUM)}
                  >
                    Albums
                  </Button>
                  <Button
                    variant={viewAs === PlaylistView.ARTIST ? 'contained' : 'outlined'}
                    onClick={(): void => onSelectView(PlaylistView.ARTIST)}
                  >
                    Artists
                  </Button>
                  <Button
                    variant={viewAs === PlaylistView.PLAYLIST ? 'contained' : 'outlined'}
                    onClick={(): void => onSelectView(PlaylistView.PLAYLIST)}
                  >
                    Playlist
                  </Button>
                </ButtonGroup>
              </Container>
              <TrackList
                progress={progress}
                tracks={tracks}
                showProgress={showProgress}
                isResolved={isResolved}
                viewAs={viewAs}
                selectedArtist={selectedArtist}
                key={`TrackList_${id}`}
              />
            </div>
          </div>
        )}
      </PageContainer>
    </Layout>
  );
};

export default Playlist;
