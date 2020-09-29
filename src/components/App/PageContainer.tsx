import React from 'react';

import Container from '@material-ui/core/Container';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const PageContainer: React.FC = ({ children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <Container className={styles.container}>
      <>{children}</>
    </Container>
  );
};

export default PageContainer;
