import { FC } from 'react';

interface ArtistLinkProps {
  artist: SpotifyArtist;
}

const ArtistLink: FC<ArtistLinkProps> = ({ artist }) => <>{artist.name}</>;

export default ArtistLink;
