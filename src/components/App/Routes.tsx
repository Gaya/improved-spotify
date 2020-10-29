import { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import AuthRoutes from '../Auth/Routes';
import PlaylistRoutes from '../Playlists/Routes';
import Browse from '../Playlists/pages/Browse';

import ProtectedRoute from './ProtectedRoute';

const Routes: FC = () => (
  <Switch>
    <Route path="/auth" component={AuthRoutes} />
    <ProtectedRoute path="/playlist" component={PlaylistRoutes} />
    <ProtectedRoute component={Browse} />
  </Switch>
);

export default Routes;
