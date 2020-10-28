import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { log } from '../../utils/logging';
import AuthContext from '../Auth/context';

interface PlayerContextValues {
  player?: SpotifyWebPlayer;
  playbackState?: WebPlaybackState;
  playback?: WebPlaybackPlayer;
}

const PlayerContext = createContext<PlayerContextValues>({});

export const PlayerProvider: React.FC = ({ children }) => {
  const { isLoggedIn, getValidToken } = useContext(AuthContext);

  const [player, setPlayer] = useState<SpotifyWebPlayer>();
  const [playback, setPlayback] = useState<WebPlaybackPlayer>();
  const [playbackState, setPlaybackState] = useState<WebPlaybackState>();

  const value = {
    player,
    playbackState,
    playback,
  };

  useEffect(() => {
    if (player) {
      return;
    }

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

      setPlayer(spotifyPlayer);
    };
  }, [getValidToken, player]);

  useEffect(() => {
    // connect player when logged in and not connected yet
    if (player && isLoggedIn && !playback) {
      player.connect().then((success) => {
        log(success ? 'Spotify Player connected' : 'Spotify Player failed to connect');
      });
    }

    // disconnect player when user logs out
    if (player && !isLoggedIn && playback) {
      player.disconnect();
      setPlayback(undefined);
      log('Spotify Player disconnected');
    }
  }, [isLoggedIn, playback, player]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;
