import React, { useEffect } from 'react';

export const PlayerProvider: React.FC = ({ children }) => {
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = (): void => {
      console.log('Loaded');
    };
  }, []);

  return <>{children}</>;
};
