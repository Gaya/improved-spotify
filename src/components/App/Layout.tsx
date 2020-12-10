import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import Toolbar from '@material-ui/core/Toolbar';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { queueOpened } from '../../state/atoms';

import UserMenu from '../User/UserMenu';
import CompactPlaylists from '../Playlists/components/CompactPlaylists';
import Player from '../Player/Player';
import QueueToggle from '../Queue/components/QueueToggle';
import { QUEUE_WIDTH } from '../Queue/consts';
import About from '../About/About';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    backgroundColor: theme.palette.background.paper,
    width: 220,
    flexGrow: 0,
    flexShrink: 0,
    borderRightStyle: 'solid',
    borderRightWidth: 2,
    borderRightColor: '#010102',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarPlaylists: {
    flexShrink: 0,
    flexGrow: 1,
    overflow: 'auto',
  },
  sidebarAbout: {
    flexGrow: 0,
    flexShrink: 1,
  },
  toolbarContainer: {
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
    flexGrow: 0,
    flexShrink: 0,
    height: 74,
  },
  toolbar: {
    minHeight: 74,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  player: {
    flexGrow: 1,
  },
  queueToggle: {
    marginLeft: theme.spacing(2),
  },
  queueSpacer: {
    flexShrink: 0,
    width: 0,
    transition: 'width 300ms ease',
  },
  queueSpacerOpened: {
    width: QUEUE_WIDTH,
  },
  contentWrapper: {
    display: 'flex',
    width: '100%',
  },
}));

const Layout: FC = ({ children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const isQueueOpened = useRecoilValue(queueOpened);

  return (
    <section className={styles.container}>
      <section className={styles.sidebar}>
        <section className={styles.sidebarPlaylists}>
          <CompactPlaylists />
        </section>
        <section className={styles.sidebarAbout}>
          <About />
        </section>
      </section>
      <section className={styles.contentWrapper}>
        <section className={styles.content}>
          <section className={styles.toolbarContainer}>
            <Toolbar className={styles.toolbar} variant="dense">
              <div className={styles.player}>
                <Player />
              </div>
              <UserMenu />
              <div className={styles.queueToggle}>
                <QueueToggle />
              </div>
            </Toolbar>
          </section>
          {children}
        </section>
        <div
          className={classNames(styles.queueSpacer, { [styles.queueSpacerOpened]: isQueueOpened })}
        />
      </section>
    </section>
  );
};

export default Layout;
