import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

import AuthPage from './AuthPage';

const Routes: React.FC<RouteComponentProps> = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route exact path={match.path} component={AuthPage} />
  </Switch>
);

export default Routes;
