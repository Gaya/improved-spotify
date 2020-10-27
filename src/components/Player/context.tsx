import React, { createContext, useEffect, useState } from 'react';

import { log } from '../../utils/logging';
import { getValidToken } from '../Auth/utils';

interface PlayerContextValues {
  player?: SpotifyWebPlayer;
}

const PlayerContext = createContext<PlayerContextValues>({});

export const PlayerProvider: React.FC = ({ children }) => {
  const [player, setPlayer] = useState<SpotifyWebPlayer>();

  const value = {
    player,
  };

  useEffect(() => {
    log('Load Spotify Player');

    // add script to body
    const script = document.createElement('script');
    script.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js');
    document.body.appendChild(script);

    // wait for loading
    window.onSpotifyWebPlaybackSDKReady = (): void => {
      log('Spotify Player Loaded');

      const spotifyPlayer = new window.Spotify.Player({
        name: 'Spotify Revised',
        getOAuthToken: (resolve): void => {
          getValidToken().then((token) => resolve(token.access_token));
        },
      });

      setPlayer(spotifyPlayer);

      console.log(spotifyPlayer);
    };
  }, []);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export default PlayerContext;
