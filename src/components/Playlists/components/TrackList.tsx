import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { playlistTracksQuery } from '../../../state/selectors';

interface TrackListProps {
  id: string;
}

const TrackList: React.FC<TrackListProps> = ({ id }) => {
  const tracks = useRecoilValueLoadable(playlistTracksQuery(id));

  console.log(tracks);

  return (
    <div>
      Tracks
    </div>
  );
};

export default TrackList;
