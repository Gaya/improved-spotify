import React from 'react';

interface ArtistLinkProps {
  artist: SpotifyArtist;
}

const ArtistLink: React.FC<ArtistLinkProps> = ({ artist }) => <>{artist.name}</>;

export default ArtistLink;
