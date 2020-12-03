import { FC } from 'react';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

const useStyles = makeStyles((theme) => ({
  title: {
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
    paddingBottom: theme.spacing(1),
    flexGrow: 1,
  },
  subtitle: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

interface PageTitleProps {
  title?: string;
  subtitle?: string;
}

const PageTitle: FC<PageTitleProps> = ({ title, subtitle, children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <div className={styles.title}>
      <Typography variant="h4">
        {title || children}
      </Typography>
      {subtitle && (
        <Typography className={styles.subtitle} variant="body1">
          {subtitle}
        </Typography>
      )}
    </div>
  );
};

export default PageTitle;
