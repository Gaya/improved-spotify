import React from 'react';

import useArtistInfo from '../hooks/useArtistInfo';

interface ArtistLinkProps {
  id: string;
}

const ArtistLink: React.FC<ArtistLinkProps> = ({ id }) => {
  const artist = useArtistInfo(id);

  if (artist.state === 'loading') {
    return null;
  }

  if (artist.state === 'hasError') {
    return <>Error loading artist</>;
  }

  return <>{artist.contents.name}</>;
};

export default ArtistLink;
