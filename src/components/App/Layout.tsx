import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

import UserMenu from '../User/UserMenu';
import CompactPlaylists from '../Playlists/CompactPlaylists';

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
  toolbar: {
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
  },
  content: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Layout: React.FC = ({ children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <section className={styles.container}>
      <section className={styles.sidebar}>
        <CompactPlaylists />
      </section>
      <section className={styles.content}>
        <section className={styles.toolbar}>
          <Toolbar variant="dense">
            <Typography className={styles.title}>
              Room for play controls
            </Typography>
            <UserMenu />
          </Toolbar>
        </section>
        {children}
      </section>
    </section>
  );
};

export default Layout;
