import { FC, useContext } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';

import AuthContext from '../Auth/context';

const ProtectedRoute: FC<RouteProps> = ({
  location,
  component,
  render,
  children,
  path,
  exact,
  sensitive,
  strict,
}) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return (
      <Redirect to="/auth/login" />
    );
  }

  return (
    <Route
      location={location}
      component={component}
      render={render}
      path={path}
      exact={exact}
      sensitive={sensitive}
      strict={strict}
    >
      {children}
    </Route>
  );
};

export default ProtectedRoute;
