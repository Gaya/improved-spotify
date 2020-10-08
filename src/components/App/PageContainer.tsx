import React from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
  },
}));

const PageContainer: React.FC = ({ children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <div className={styles.container}>{children}</div>
  );
};

export default PageContainer;
