import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { playlistQuery } from '../../../state/selectors';

const useStyles = makeStyles({
  container: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    borderRadius: 6,
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
});

interface ImageProps {
  id: string;
}

const Image: React.FC<ImageProps> = ({ id }: ImageProps) => {
  const styles = useStyles();
  const playlist = useRecoilValueLoadable(playlistQuery(id));

  return (
    <div className={styles.container}>
      {playlist.state === 'hasValue' && playlist.contents && (
        <img
          className={styles.image}
          alt={playlist.contents.name}
          src={playlist.contents.images[0].url}
        />
      )}
    </div>
  );
};

export default Image;
