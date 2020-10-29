import { FC } from 'react';

interface AlbumLinkProps {
  album: SpotifyAlbum;
}

const AlbumLink: FC<AlbumLinkProps> = ({ album }) => <>{album.name}</>;

export default AlbumLink;
