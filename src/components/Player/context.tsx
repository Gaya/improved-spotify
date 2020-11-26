import React, {
  createContext, useCallback,
  useContext,
  useEffect,
  useMemo, useRef,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';

import { getAlbumTracks, playerPlay } from '../../utils/externalData';
import { error, info, log } from '../../utils/logging';
import { songQueue } from '../../state/atoms';

import AuthContext from '../Auth/context';

interface PlayerContextValues {
  player?: SpotifyWebPlayer;
  playbackState: PlayerPlaybackState;
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

const defaultPlaybackState = { paused: true, position: 0 };

const PlayerContext = createContext<PlayerContextValues>({
  actions: defaultActions,
  playbackState: defaultPlaybackState,
});

export const PlayerProvider: React.FC = ({ children }) => {
  const { isLoggedIn, getValidToken } = useContext(AuthContext);
  const [queue, setQueue] = useRecoilState(songQueue);

  const [player, setPlayer] = useState<SpotifyWebPlayer>();
  const [playback, setPlayback] = useState<WebPlaybackPlayer>();
  const [playbackState, setPlaybackState] = useState<PlayerPlaybackState>(defaultPlaybackState);
  const [webPlaybackState, setWebPlaybackState] = useState<WebPlaybackState>();
  const resumeTimeRef = useRef(0);

  const usePlayback = false;
  const currentTrack = playbackState.current;

  const playSong = useCallback((song: SpotifyAlbumTrack, nextQueue: SongQueue) => {
    if (!playback) {
      return;
    }

    if (usePlayback) {
      playerPlay({ context_uri: song.uri }, playback.device_id);
    }

    setQueue(nextQueue);
    setPlaybackState({ paused: false, position: 0, current: song });

    info(`Play ${song.name}`);
  }, [playback, setQueue, usePlayback]);

  const previous = useCallback((currentQueue: SongQueue): void => {
    if (!player || !playback) {
      return;
    }

    const [song, ...previous] = currentQueue.previous;

    if (!song) {
      info('No previous song play');
      return;
    }

    playSong(song, { ...currentQueue, previous });
  }, [playSong, playback, player]);

  const next = useCallback((currentQueue: SongQueue, currentSong?: SpotifyAlbumTrack): void => {
    if (!player || !playback) {
      return;
    }

    const [song, ...next] = currentQueue.next;

    if (!song) {
      info('No song in queue to play');
      return;
    }

    const previous = currentSong
      ? [currentSong, ...currentQueue.previous]
      : currentQueue.previous;

    playSong(song, { previous, next });
  }, [playSong, playback, player]);

  const play = useCallback((currentQueue = queue, forcePlay = false): void => {
    if (!player || !playback) {
      return;
    }

    resumeTimeRef.current = +new Date();

    // no song is playing yet, so pick first from queue
    if (!playbackState.current || forcePlay) {
      next(currentQueue, playbackState.current);
      return;
    }

    if (playbackState.current) {
      if (usePlayback) {
        player.resume();
      }

      setPlaybackState({ ...playbackState, paused: false });
      info('Resume playback');
    }
  }, [next, playback, playbackState, player, queue, usePlayback]);

  const pause = useCallback((): void => {
    if (!player) {
      return;
    }

    player.pause();

    setPlaybackState({ ...playbackState, paused: true });

    info('Pause playback');
  }, [playbackState, player]);

  /**
   * Determine exposed actions
   */
  const actions = useMemo(() => {
    if (!player || !playback) {
      return defaultActions;
    }

    return {
      next(): void {
        if (!currentTrack) {
          return;
        }

        info('Go to next');
        next(queue, currentTrack);
      },
      previous(): void {
        if (!currentTrack) {
          return;
        }

        info('Go to previous');
        previous(queue);
      },
      resume(): void {
        play();
      },
      pause(): void {
        pause();
      },
      playAlbum(id: string): Promise<void> {
        log(`Playing album ${id}`);

        return getAlbumTracks(id)
          .then((tracks) => {
            const nextQueue: SongQueue = { ...queue, next: tracks };
            return nextQueue;
          })
          .then((nextQueue) => play(nextQueue, true));
      },
      queueAlbum(id: string): Promise<void> {
        log(`Queueing album ${id}`);

        return getAlbumTracks(id)
          .then((tracks) => setQueue({ ...queue, next: [...queue.next, ...tracks] }));
      },
    };
  }, [currentTrack, next, pause, play, playback, player, previous, queue, setQueue]);

  /**
   * Calculate and memoize context value
   */
  const value = useMemo(() => ({
    player,
    playbackState,
    playback,
    actions,
  }), [actions, playback, playbackState, player]);

  /**
   * Keep our player in sync with Spotify
   */
  useEffect(() => {
    if (!player) {
      return (): void => undefined;
    }

    const id = setInterval(() => {
      player.getCurrentState().then((state) => {
        // @todo update playback state if changed on spotify
      });
    }, 500);

    return (): void => clearInterval(id);
  }, [player]);

  /**
   * Load and initialize Spotify player
   */
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
          getValidToken().then((token) => {
            if (!token) {
              error('Couldn\'t resolve token.');
              return;
            }

            resolve(token.access_token);
          });
        },
      });

      spotifyPlayer.addListener('player_state_changed', setWebPlaybackState);
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
