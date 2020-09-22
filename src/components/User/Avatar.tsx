import React from 'react';
import { useRecoilValueLoadable } from 'recoil';

import makeStyles from '@material-ui/core/styles/makeStyles';
import MUIAvatar from '@material-ui/core/Avatar';

import { userInformationQuery } from '../../state/atoms';

const useStyles = makeStyles({
  avatar: {
    width: 30,
    height: 30,
  },
});

const Avatar: React.FC = () => {
  const styles = useStyles();
  const user = useRecoilValueLoadable(userInformationQuery);

  if (user.state === 'hasError') {
    throw user.contents;
  }

  return (
    <MUIAvatar
      className={styles.avatar}
      src={user.state === 'hasValue' ? user.contents.images[0].url : undefined}
    />
  );
};

export default Avatar;
