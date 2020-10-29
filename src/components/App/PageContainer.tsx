import { FC } from 'react';
import classNames from 'classnames';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
  },
  containerPadding: {
    paddingTop: theme.spacing(3),
  },
}));

interface PageContainerProps {
  topPadding?: boolean;
}

const PageContainer: FC<PageContainerProps> = ({ children, topPadding = false }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <div className={classNames(styles.container, { [styles.containerPadding]: topPadding })}>
      {children}
    </div>
  );
};

export default PageContainer;
