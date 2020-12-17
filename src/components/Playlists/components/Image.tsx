import { FC } from 'react';
import { useRecoilValueLoadable } from 'recoil';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

import { playlistQuery } from '../../../state/selectors';

const useStyles = makeStyles((theme) => ({
  container: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: theme.palette.background.paper,
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
}));

interface ImageProps {
  id: string;
}

const Image: FC<ImageProps> = ({ id }: ImageProps) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const playlist = useRecoilValueLoadable(playlistQuery(id));

  return (
    <div className={styles.container}>
      {playlist.state === 'hasValue' && playlist.contents && playlist.contents.images[0] && (
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
