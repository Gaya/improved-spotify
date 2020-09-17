import React, { useContext } from 'react';
import { Button } from '@material-ui/core';

import AuthButton from '../../utils/Auth/components/AuthButton';
import AuthContext from '../../utils/Auth/context';

const Default: React.FC = () => {
  const { isLoggedIn, logOut } = useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <div>
        <AuthButton />
      </div>
    );
  }

  return (
    <div>
      Welcome!
      <Button variant="contained" onClick={logOut}>Logout</Button>
    </div>
  );
};

export default Default;
