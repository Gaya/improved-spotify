import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Avatar from '../User/Avatar';

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

const Layout: React.FC = ({ children }) => {
  const styles = useStyles();

  return (
    <section>
      <AppBar position="static" color="transparent">
        <Toolbar variant="dense">
          <Typography variant="h6" className={styles.title}>
            Improved Spotify
          </Typography>
          <Avatar />
        </Toolbar>
      </AppBar>
      {children}
    </section>
  );
};

export default Layout;
