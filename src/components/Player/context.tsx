import React, { createContext, useEffect, useState } from 'react';
import { log } from '../../utils/logging';

interface PlayerContextValues {
  player: string;
}

const PlayerContext = createContext<PlayerContextValues>({
  player: '',
});

export const PlayerProvider: React.FC = ({ children }) => {
  const [player, setPlayer] = useState('');

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

      setPlayer('yep');
    };
  }, []);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export default PlayerContext;
