import React from 'react';

import { SpotifyAlbum } from '../../../types';

interface AlbumLinkProps {
  album: SpotifyAlbum;
}

const AlbumLink: React.FC<AlbumLinkProps> = ({ album }) => <>{album.name}</>;

export default AlbumLink;
