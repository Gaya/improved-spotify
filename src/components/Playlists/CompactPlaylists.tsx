import React from 'react';
import { useRecoilValueLoadable } from 'recoil';

import { playlistsQuery } from '../../state/selectors';

const CompactPlaylists: React.FC = () => {
  const playlists = useRecoilValueLoadable(playlistsQuery);

  console.log(playlists);

  return (
    <div>
      Playlists
    </div>
  );
};

export default CompactPlaylists;
