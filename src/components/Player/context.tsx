import React, { createContext, useEffect } from 'react';

interface PlayerContextValues {
  player: string;
}

const PlayerContext = createContext<PlayerContextValues>({
  player: '',
});

export const PlayerProvider: React.FC = ({ children }) => {
  const value = {
    player: '',
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js');
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = (): void => {
      console.log('Loaded');
    };
  }, []);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export default PlayerContext;
