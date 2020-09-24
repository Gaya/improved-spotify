import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { playlistQuery } from '../../../state/selectors';
import htmlDecode from '../../../utils/htmlDecode';

import PageTitle from '../../PageTitle/PageTitle';
import Layout from '../../App/Layout';
import PageContainer from '../../App/PageContainer';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';

import Image from '../components/Image';

type PlaylistProps = RouteComponentProps<{ id: string }>;

const Playlist: React.FC<PlaylistProps> = ({ match }: PlaylistProps) => {
  const { id } = match.params;

  const playlist = useRecoilValueLoadable(playlistQuery(id));

  return (
    <Layout>
      <PageContainer>
        {playlist.state !== 'hasValue' && <LoadingIndicator />}
        {playlist.state === 'hasValue' && playlist.contents && (
          <div>
            <Image id={id} />
            <PageTitle
              title={htmlDecode(playlist.contents.name)}
              subtitle={htmlDecode(playlist.contents.description)}
            />
          </div>
        )}
      </PageContainer>
    </Layout>
  );
};

export default Playlist;
