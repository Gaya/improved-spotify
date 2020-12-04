/* eslint-disable camelcase */

interface WebPlayerTrack {
  uri: string;
  id: string | null;
  type: 'track' | 'episode' | 'ad';
  media_type: 'video' | 'audio';
  name: string;
  is_playable: boolean;
  album: {
    uri: string;
    name: string;
    images: { url: string }[];
  };
  artists: { uri: string; name: string }[];
}

interface WebPlaybackError {
  message: string;
}

interface SpotifyPlayerConstructorOptions {
  name: string;
  getOAuthToken(cb: (token: string) => void): void;
  volume?: number;
}

declare global {
  interface WebPlaybackPlayer {
    device_id: string;
  }

  interface WebPlaybackState {
    context: {
      uri: string | null;
      metadata: unknown | null;
    };
    disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
    };
    paused: boolean;
    position: number;
    duration: number;
    repeat_mode: 0 | 1 | 2;
    shuffle: boolean;
    track_window: {
      current_track: WebPlayerTrack;
      previous_tracks: WebPlayerTrack[];
      next_tracks: WebPlayerTrack[];
    };
  }

  interface SpotifyWebPlayer {
    /**
     * Connect our Web Playback SDK instance to Spotify with the credentials provided during
     * initialization.
     *
     * Returns a Promise containing a Boolean (either true or false) with the success of the
     * connection.
     */
    connect(): Promise<boolean>;

    /**
     * Closes the current session our Web Playback SDK has with Spotify.
     */
    disconnect(): void;

    removeListener(name: string);

    removeListener(name: string, callback: typeof Function);

    getCurrentState(): Promise<WebPlaybackState | null>;

    /**
     * Rename the Spotify Player device. This is visible across all Spotify Connect devices.
     *
     * @param name
     */
    setName(name: string): Promise<void>;

    getVolume(): Promse<number>;

    setVolume(volume: number): Promse<void>;

    pause(): Promise<void>;

    resume(): Promise<void>;

    togglePlay(): Promise<void>;

    seek(milliseconds: number): Promise<void>;

    previousTrack(): Promise<void>;

    nextTrack(): Promise<void>;

    /**
     * Create a new event listener in the Web Playback SDK.
     *
     * Returns a Boolean. Returns true if the event listener for the event_name is unique.
     * See #removeListener for removing existing listeners.
     *
     * @param name
     * @param callback
     */
    addListener(name: string, callback: typeof Function): boolean;

    addListener(name: 'ready', callback: (player: WebPlaybackPlayer) => void);

    addListener(name: 'not_ready', callback: (player: WebPlaybackPlayer) => void);

    addListener(name: 'player_state_changed', callback: (state: WebPlaybackState) => void);

    addListener(name: 'initialization_error', callback: (error: WebPlaybackError) => void);

    addListener(name: 'authentication_error', callback: (error: WebPlaybackError) => void);

    addListener(name: 'account_error', callback: (error: WebPlaybackError) => void);

    addListener(name: 'playback_error', callback: (error: WebPlaybackError) => void);
  }

  interface SpotifyPlayer extends SpotifyWebPlayer {
    /**
     * The main constructor for initializing the Web Playback SDK. It should contain an object with
     * the player name, volume and access token.
     *
     * @param options
     */
    new (options: SpotifyPlayerConstructorOptions): SpotifyWebPlayer;
  }

  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: SpotifyPlayer;
    };
  }
}

export {};
