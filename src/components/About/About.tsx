import { FC, useState } from 'react';

import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Link from '@material-ui/core/Link';

const About: FC = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const handleOpen = () => setIsOpened(true);
  const handleClose = () => setIsOpened(false);

  return (
    <>
      <Button size="small" onClick={handleOpen} fullWidth startIcon={<InfoIcon />}>
        About Plaotje
      </Button>
      <Dialog open={isOpened} onClose={handleClose} aria-labelledby="about-plaotje-title">
        <DialogTitle id="about-plaotje-title">
          About Plaotje
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>
              Plaotje is a project born from the frustration of
              {' '}
              <Link href="https://theclevernode.com/about">Gaya Kessler</Link>
              {' '}
              with the
              {' '}
              <Link href="https://spotify.com">Spotify platform</Link>
              .
            </p>
            <p>
              Being a fan listening to full albums, Spotify leaves much to be desired. Searching is
              cumbersome and putting albums on a playlist doesn&apos;t help much.
            </p>
            <p>
              Plaotje makes browsing your playlists a bit more old school. Making it possible to
              browse by artist and albums like we used to have in for instance iTunes.
            </p>
            <p>
              The project is
              {' '}
              <Link href="https://github.com/Gaya/plaotje">completely open source</Link>
              {' '}
              and I welcome everyone to come and contribute to the project.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default About;
