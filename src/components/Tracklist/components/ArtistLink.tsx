import React from 'react';

import { SpotifyArtist } from '../../../types';

interface ArtistLinkProps {
  artist: SpotifyArtist;
}

const ArtistLink: React.FC<ArtistLinkProps> = ({ artist }) => <>{artist.name}</>;

export default ArtistLink;
