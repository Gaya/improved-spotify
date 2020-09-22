import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

import Auth from '../pages/Auth';
import Login from '../pages/Login';

const Routes: React.FC<RouteComponentProps> = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route exact path={`${match.path}/login`} component={Login} />
    <Route exact path={match.path} component={Auth} />
  </Switch>
);

export default Routes;
