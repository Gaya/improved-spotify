import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

import Playlist from './pages/Playlist';

const Routes: React.FC<RouteComponentProps> = ({ match }: RouteComponentProps) => (
  <Switch>
    <Route exact path={`${match.path}/:id`} component={Playlist} />
  </Switch>
);

export default Routes;
