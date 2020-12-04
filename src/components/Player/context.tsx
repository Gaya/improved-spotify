import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';

import { getAlbumTracks, playerPlay } from '../../utils/externalData';
import { error, info, log } from '../../utils/logging';
import { songQueue } from '../../state/atoms';

import AuthContext from '../Auth/context';

import useInterval from './hooks/useInterval';
import usePlaybackState from './hooks/usePlayerState';

interface PlayerContextValues {
  player?: SpotifyWebPlayer;
  playbackState: PlayerPlaybackState;
  playback?: WebPlaybackPlayer;
  actions: {
    next(): void;
    previous(): void;
    resume(): void;
    pause(): void;
    seek(seekTo: number): void;
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
  seek(): void {
    return undefined;
  },
  playAlbum(): Promise<void> {
    return Promise.resolve();
  },
  queueAlbum(): Promise<void> {
    return Promise.resolve();
  },
};

const defaultPlaybackState = {
  paused: true,
  position: 0,
  playbackStarted: 0,
  playbackPosition: 0,
};

const PlayerContext = createContext<PlayerContextValues>({
  actions: defaultActions,
  playbackState: defaultPlaybackState,
});

export const PlayerProvider: FC = ({ children }) => {
  const { isLoggedIn, getValidToken } = useContext(AuthContext);
  const [queue, setQueue] = useRecoilState(songQueue);

  const [player, setPlayer] = useState<SpotifyWebPlayer>();
  const [playback, setPlayback] = useState<WebPlaybackPlayer>();
  const [playbackState, dispatchPlaybackState] = usePlaybackState(defaultPlaybackState);
  const resumeTimeRef = useRef(0);

  // disable this to toggle of web player
  const usePlayback = true;
  const currentTrack = playbackState.current;

  /**
   * Create player playback functionality
   */
  const playSong = useCallback((song: SpotifyAlbumTrack, nextQueue: SongQueue) => {
    if (!playback) {
      return;
    }

    if (usePlayback) {
      playerPlay({ uris: [song.uri] }, playback.device_id).catch(error);
    }

    setQueue(nextQueue);
    dispatchPlaybackState({
      type: 'PLAY_SONG',
      song,
    });

    info(`Play ${song.name}`);
  }, [dispatchPlaybackState, playback, setQueue, usePlayback]);

  const previous = useCallback((currentQueue: SongQueue): void => {
    if (!player || !playback) {
      return;
    }

    const [song, ...previousSongs] = currentQueue.previous;

    if (!song) {
      info('No previous song play');
      return;
    }

    playSong(song, { ...currentQueue, previous: previousSongs });
  }, [playSong, playback, player]);

  const next = useCallback((currentQueue: SongQueue, currentSong?: SpotifyAlbumTrack): void => {
    if (!player || !playback) {
      return;
    }

    const [song, ...nextSongs] = currentQueue.next;

    if (!song) {
      info('No song in queue to play');
      dispatchPlaybackState({ type: 'STOP_SONG' });
      return;
    }

    const previousSongs = currentSong
      ? [currentSong, ...currentQueue.previous]
      : currentQueue.previous;

    playSong(song, { previous: previousSongs, next: nextSongs });
  }, [dispatchPlaybackState, playSong, playback, player]);

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
        player.resume().catch(error);
      }

      dispatchPlaybackState({ type: 'RESUME_SONG', position: playbackState.position });

      info('Resume playback');
    }
  }, [dispatchPlaybackState, next, playback, playbackState, player, queue, usePlayback]);

  const pause = useCallback((): void => {
    if (!player) {
      return;
    }

    if (usePlayback) {
      player.pause().catch(error);
    }

    dispatchPlaybackState({ type: 'PAUSE_SONG' });

    info('Pause playback');
  }, [dispatchPlaybackState, player, usePlayback]);

  const seek = useCallback((seekTo: number): void => {
    if (!player) {
      return;
    }

    if (usePlayback) {
      player.seek(seekTo).catch(error);
    }

    dispatchPlaybackState({
      type: 'SEEK_SONG',
      position: seekTo,
    });

    info(`Seeking to ${seekTo}`);
  }, [dispatchPlaybackState, player, usePlayback]);

  /**
   * Setup player next song in line
   */
  useInterval(() => {
    if (playbackState && !playbackState.paused) {
      const elapsed = +new Date() - playbackState.playbackStarted;
      const position = playbackState.playbackPosition + elapsed;

      if (playbackState.current && playbackState.current.duration_ms <= position) {
        next(queue);
      }
    }
  }, 100);

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
      seek(seekTo: number): void {
        if (!currentTrack) {
          return;
        }

        seek(seekTo);
      },
      resume(): void {
        play();
      },
      pause(): void {
        if (!currentTrack) {
          return;
        }

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
  }, [currentTrack, next, pause, play, playback, player, previous, queue, seek, setQueue]);

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
  useInterval(() => {
    if (!player) {
      return;
    }

    player.getCurrentState().then((state) => {
      if (state && !state.paused) {
        // update elapsed time
        dispatchPlaybackState({ type: 'UPDATE_POSITION_SONG', position: state.position });
      }
    });
  }, 500);

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
