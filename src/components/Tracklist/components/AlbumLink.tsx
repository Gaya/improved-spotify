import React from 'react';

interface AlbumLinkProps {
  album: SpotifyAlbum;
}

const AlbumLink: React.FC<AlbumLinkProps> = ({ album }) => <>{album.name}</>;

export default AlbumLink;
