import React from 'react';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

const useStyles = makeStyles((theme) => ({
  title: {
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
}));

const PageTitle: React.FC = ({ children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <Typography className={styles.title} variant="h5">
      {children}
    </Typography>
  );
};

export default PageTitle;
