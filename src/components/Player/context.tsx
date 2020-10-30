import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addToQueue,
  getAlbumTracks,
  playerPlay,
  transferPlayback,
} from '../../utils/externalData';
import { log } from '../../utils/logging';

import AuthContext from '../Auth/context';

interface PlayerContextValues {
  player?: SpotifyWebPlayer;
  playbackState?: WebPlaybackState;
  playback?: WebPlaybackPlayer;
  actions: {
    next(): void;
    previous(): void;
    resume(): void;
    pause(): void;
    playAlbum(id: string): Promise<void>;
    queueAlbum(id: string): Promise<void>;
  };
}

const defaultActions = {
  next(): void {
    return undefined;
  },
  previous(): void {
    return undefined;
  },
  resume(): void {
    return undefined;
  },
  pause(): void {
    return undefined;
  },
  playAlbum(): Promise<void> {
    return Promise.resolve();
  },
  queueAlbum(): Promise<void> {
    return Promise.resolve();
  },
};

function waitForTrack(player: SpotifyWebPlayer, track: string): Promise<void> {
  return player.getCurrentState()
    .then((state) => {
      if (state && state.track_window.next_tracks.find((t) => t.uri === track)) {
        log('Track was queued');
        return undefined;
      }

      return new Promise((resolve) => setTimeout(resolve, 100))
        .then(() => waitForTrack(player, track));
    });
}

function queueTracks(
  tracks: SpotifyTrackInfo[],
  player: SpotifyWebPlayer,
  playback: WebPlaybackPlayer,
): Promise<void> {
  if (tracks.length === 0) {
    return Promise.resolve();
  }

  const [firstTrack, ...otherTracks] = tracks;

  return player.getCurrentState()
    .then((state) => {
      if (!state) {
        log('Transferring playback');
        return transferPlayback(playback.device_id);
      }

      return undefined;
    }).then(() => addToQueue(firstTrack.uri, playback.device_id))
    .then(() => waitForTrack(player, firstTrack.uri))
    .then(() => queueTracks(otherTracks, player, playback));
}

const PlayerContext = createContext<PlayerContextValues>({ actions: defaultActions });

export const PlayerProvider: React.FC = ({ children }) => {
  const { isLoggedIn, getValidToken } = useContext(AuthContext);

  const [player, setPlayer] = useState<SpotifyWebPlayer>();
  const [playback, setPlayback] = useState<WebPlaybackPlayer>();
  const [playbackState, setPlaybackState] = useState<WebPlaybackState>();

  const actions = useMemo(() => {
    if (!player || !playback) {
      return defaultActions;
    }

    return {
      next(): void {
        log('Skip track');
        player.nextTrack();
      },
      previous(): void {
        log('Go to previous track');
        player.previousTrack();
      },
      resume(): void {
        log('Play track');
        player.resume();
      },
      pause(): void {
        log('Pause track');
        player.pause();
      },
      playAlbum(id: string): Promise<void> {
        log(`Playing album ${id}`);

        return getAlbumTracks(id)
          .then((tracks) => playerPlay({ uris: tracks.map((t) => t.uri) }, playback.device_id))
          .then();
      },
      queueAlbum(id: string): Promise<void> {
        log(`Queueing album ${id}`);

        return getAlbumTracks(id)
          .then((tracks) => queueTracks(tracks, player, playback))
          .then();
      },
    };
  }, [playback, player]);

  const value = useMemo(() => ({
    player,
    playbackState,
    playback,
    actions,
  }), [actions, playback, playbackState, player]);

  useEffect(() => {
    if (!player) {
      return (): void => undefined;
    }

    const id = setInterval(() => {
      player.getCurrentState().then((state) => setPlaybackState(state || undefined));
    }, 500);

    return (): void => clearInterval(id);
  }, [player]);

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
