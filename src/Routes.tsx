import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AuthPage from './utils/Auth/components/AuthPage';

import Default from './pages/Default/Default';

const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/auth" component={AuthPage} />
    <Route component={Default} />
  </Switch>
);

export default Routes;
