import { FC, useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { songQueue } from '../../../state/atoms';
import QueueList from './QueueList';

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
    marginBottom: theme.spacing(1),
    justifyContent: 'space-between',
  },
}));

enum QueueView {
  NEXT = 'NEXT',
  PREVIOUS = 'PREVIOUS',
}

const Queue: FC = () => {
  const [view, setView] = useState<QueueView>(QueueView.NEXT);
  const [queue, setQueue] = useRecoilState(songQueue);
  const theme = useTheme();
  const styles = useStyles(theme);

  const toggleView = () => setView(view === QueueView.NEXT ? QueueView.PREVIOUS : QueueView.NEXT);
  const onRemoveFromQueue = useCallback((index?: number) => {
    const next = typeof index !== 'undefined' ? queue.next.filter((_, i) => i !== index) : [];
    setQueue({ ...queue, next });
  }, [queue, setQueue]);

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <Typography variant="h6">
          {view === QueueView.NEXT ? 'Playing Next' : 'History'}
        </Typography>
        <Button variant="text" color="primary" onClick={toggleView}>
          {view === QueueView.NEXT ? 'History' : 'Playing Next'}
        </Button>
      </section>
      <QueueList
        emptyText={view === QueueView.NEXT ? 'No upcoming songs.' : 'No previous songs.'}
        tracks={view === QueueView.NEXT ? queue.next : queue.previous}
        onRemove={view === QueueView.NEXT ? onRemoveFromQueue : undefined}
      />
    </div>
  );
};

export default Queue;
