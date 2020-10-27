import React, { createContext, useEffect, useState } from 'react';

import { log, table } from '../../utils/logging';
import { getValidToken } from '../Auth/utils';

interface PlayerContextValues {
  player?: SpotifyWebPlayer;
  playbackState?: WebPlaybackState;
  playback?: WebPlaybackPlayer;
}

const PlayerContext = createContext<PlayerContextValues>({});

export const PlayerProvider: React.FC = ({ children }) => {
  const [player, setPlayer] = useState<SpotifyWebPlayer>();
  const [playback, setPlayback] = useState<WebPlaybackPlayer>();
  const [playbackState, setPlaybackState] = useState<WebPlaybackState>();

  const value = {
    player,
    playbackState,
    playback,
  };

  useEffect(() => {
    log('Loading Spotify Player');

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

      spotifyPlayer.addListener('player_state_changed', setPlaybackState);
      spotifyPlayer.addListener('ready', setPlayback);

      spotifyPlayer.connect().then((success) => {
        log(success ? 'Spotify Player connected' : 'Spotify Player failed to connect');
      });

      setPlayer(spotifyPlayer);
    };
  }, []);

  log({ player, playback, playbackState });

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;
