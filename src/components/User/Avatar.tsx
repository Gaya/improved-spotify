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
  const userInformation = useRecoilValueLoadable(userInformationQuery);

  console.log(userInformation);

  return <MUIAvatar className={styles.avatar} />;
};

export default Avatar;
