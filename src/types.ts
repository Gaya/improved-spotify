export interface Loadable {
  isLoading: boolean;
  isResolving: boolean;
  error?: Error;
}

export type LoadableValue<T> =
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

export interface AuthToken {
  access_token: string;
  token_type: 'Bearer';
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface StoredAuthToken extends AuthToken {
  received: number;
}

export interface PlaylistSnapshots {
  [playlistId: string]: string;
}

export interface PlaylistTracks {
  [playlistId: string]: string[];
}

export interface SpotifyImage {
  height: number | null;
  width: number | null;
  url: string;
}

export interface SpotifyUser {
  display_name: string;
  href: string;
  id: string;
  images: SpotifyImage[];
  uri: string;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: {
    [name: string]: string;
  };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyUser;
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface SpotifyArtist {
  external_urls: {
    [name: string]: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  album_type: string;
  artists: SpotifyArtist[];
  available_markets: string[];
  external_urls: {
    [name: string]: string;
  };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: 'day' | 'year';
  total_tracks: number;
  type: string;
  uri: string;
}

export interface SpotifyTrackInfo {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: {
    [name: string]: string;
  };
  external_urls: {
    [name: string]: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  added_by: {
    external_urls: {
      [name: string]: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: string | null;
  track: SpotifyTrackInfo;
  video_thumbnail: {
    url: string | null;
  };
}

export interface SpotifyCurrentPlayer {
  timestamp: number;
  device: {
    id: string;
    is_active: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
  };
  progress_ms: number;
  is_playing: boolean;
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  item: SpotifyTrackInfo | null;
  shuffle_state: boolean;
  repeat_state: 'off' | 'track' | 'context';
}

export interface StoredSpotifyPlaylistTrack extends SpotifyPlaylistTrack {
  index: number;
  id: string;
  playlistId: string;
}

export interface PlaylistTracksState {
  [playlistId: string]: TrackState;
}
