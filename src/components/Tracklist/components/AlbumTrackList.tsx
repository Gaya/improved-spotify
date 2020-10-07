import React from 'react';

import { StoredSpotifyPlaylistTrack } from '../../../types';

import useAlbumsFromTracks from '../hooks/useAlbumsFromTracks';

interface AlbumTrackListProps {
  tracks: StoredSpotifyPlaylistTrack[];
}

const AlbumTrackList: React.FC<AlbumTrackListProps> = ({ tracks }) => {
  const albums = useAlbumsFromTracks(tracks);

  if (albums.state !== 'hasValue') {
    return null;
  }

  return (
    <div>
      {albums.contents.map((album) => (
        <div key={album.id}>{album.name}</div>
      ))}
    </div>
  );
};

export default AlbumTrackList;
