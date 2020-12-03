import { FC } from 'react';
import { useRecoilState } from 'recoil';

import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { queueOpened } from '../../../state/atoms';

import { QUEUE_WIDTH } from '../consts';
import fireOnResize from '../fireOnResize';

import Queue from './Queue';

const useStyles = makeStyles({
  drawerContent: {
    width: QUEUE_WIDTH,
    flexGrow: 1,
    display: 'flex',
  },
});

const QueueToggle: FC = () => {
  const [isOpened, setOpened] = useRecoilState(queueOpened);
  const styles = useStyles();

  const onClose = () => {
    setOpened(false);
    fireOnResize();
  };

  const onOpen = () => {
    setOpened(true);
    fireOnResize();
  };

  return (
    <>
      <IconButton
        edge="end"
        aria-controls="queue"
        aria-haspopup="true"
        onClick={isOpened ? onClose : onOpen}
      >
        <QueueMusicIcon fontSize="small" color={isOpened ? 'primary' : 'action'} />
      </IconButton>
      <Drawer
        anchor="right"
        variant="persistent"
        open={isOpened}
        onClose={onClose}
        transitionDuration={300}
      >
        <div className={styles.drawerContent}>
          <Queue />
        </div>
      </Drawer>
    </>
  );
};

export default QueueToggle;
