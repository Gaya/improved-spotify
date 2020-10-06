import React from 'react';

import useAlbumInfo from './hooks/useAlbumInfo';

interface AlbumLinkProps {
  id: string;
}

const AlbumLink: React.FC<AlbumLinkProps> = ({ id }) => {
  const album = useAlbumInfo(id);

  if (album.state === 'loading') {
    return null;
  }

  if (album.state === 'hasError') {
    return <>Error loading album</>;
  }

  return <>{album.contents.name}</>;
};

export default AlbumLink;
