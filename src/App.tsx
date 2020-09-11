import React from 'react';

import { SPOTIFY_AUTH_URI, SPOTIFY_CLIENT_ID } from './consts';

const App: React.FC = () => {
  const authUrl = [
    SPOTIFY_AUTH_URI,
    SPOTIFY_CLIENT_ID,
  ].join('');

  return (
    <div className="App">
      <h1>Improved Spotify</h1>
      <a href={authUrl}>Authenticate with Spotify</a>
    </div>
  );
};

export default App;
