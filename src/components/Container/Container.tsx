import { FC } from 'react';
import classNames from 'classnames';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: theme.breakpoints.values.lg,
    width: '100%',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    margin: '0 auto',
  },
}));

interface ContainerProps {
  className?: string;
}

const Container: FC<ContainerProps> = ({ className, children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <div className={classNames(styles.container, className)}>{children}</div>
  );
};

export default Container;
