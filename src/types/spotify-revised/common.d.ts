declare global {
  enum PlaylistView {
    PLAYLIST = 'PLAYLIST',
    ALBUM = 'ALBUM',
    ARTIST = 'ARTIST',
  }

  enum TrackState {
    VALID = 'VALID',
    INVALID = 'INVALID',
  }

  interface Loadable {
    isLoading: boolean;
    isResolving: boolean;
    error?: Error;
  }

  type LoadableValue<T> =
    | Readonly<{
    state: 'hasValue';
    contents: T;
  }>
    | Readonly<{
    state: 'hasError';
    contents: Error;
  }>
    | Readonly<{
    state: 'loading';
  }>;

  interface PlaylistSnapshots {
    [playlistId: string]: string;
  }

  interface PlaylistTracks {
    [playlistId: string]: string[];
  }

  interface PlaylistTracksState {
    [playlistId: string]: TrackState;
  }

  interface StoredSpotifyPlaylistTrack extends SpotifyPlaylistTrack {
    index: number;
    id: string;
    playlistId: string;
  }
}

export {};
