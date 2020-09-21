import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import MUIAvatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
  avatar: {
    width: 30,
    height: 30,
  },
});

const Avatar: React.FC = () => {
  const styles = useStyles();

  return <MUIAvatar className={styles.avatar} />;
};

export default Avatar;
