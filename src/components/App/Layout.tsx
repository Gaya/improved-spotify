import { FC } from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

import UserMenu from '../User/UserMenu';
import CompactPlaylists from '../Playlists/components/CompactPlaylists';
import Player from '../Player/Player';

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
    overflow: 'auto',
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
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    flexGrow: 1,
  },
}));

const Layout: FC = ({ children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <section className={styles.container}>
      <section className={styles.sidebar}>
        <CompactPlaylists />
      </section>
      <section className={styles.content}>
        <section className={styles.toolbarContainer}>
          <Toolbar className={styles.toolbar} variant="dense">
            <div className={styles.title}>
              <Player />
            </div>
            <UserMenu />
          </Toolbar>
        </section>
        {children}
      </section>
    </section>
  );
};

export default Layout;
