import React from 'react';
import { useRecoilValue } from 'recoil';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { songQueue } from '../../../state/atoms';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.divider,
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(2),
    justifyContent: 'space-between',
  },
  empty: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Queue: React.FC = () => {
  const queue = useRecoilValue(songQueue);
  const theme = useTheme();
  const styles = useStyles(theme);

  console.log(queue.next);

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <Typography variant="h6">
          Playing Next
        </Typography>
        <Button variant="text" color="primary">
          History
        </Button>
      </section>
      {queue.next.length === 0 && <div className={styles.empty}>No upcoming songs.</div>}
    </div>
  );
};

export default Queue;
