import React, { useContext } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';

import AuthContext from '../../utils/Auth/context';

const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <Redirect to="/auth/login" />
    );
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Route {...props} />
  );
};

export default ProtectedRoute;
