export const APP_URI = process.env.REACT_APP_URI || '';

export const SPOTIFY_REDIRECT_URI = `${APP_URI}/auth`;
export const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '';
export const SPOTIFY_API_URI = 'https://api.spotify.com';
export const SPOTIFY_ACCOUNT_URI = 'https://accounts.spotify.com';
export const SPOTIFY_AUTH_URI = `${SPOTIFY_ACCOUNT_URI}/authorize`;
export const SPOTIFY_TOKEN_URI = `${SPOTIFY_ACCOUNT_URI}/api/token`;
export const SPOTIFY_ME_URI = `${SPOTIFY_API_URI}/v1/me`;
export const SPOTIFY_PLAYLISTS_URI = `${SPOTIFY_ME_URI}/playlists`;
export const SPOTIFY_PLAYLIST_TRACKS = `${SPOTIFY_API_URI}/v1/playlists/{id}/tracks`;
export const SPOTIFY_PLAYER_URI = `${SPOTIFY_ME_URI}/player`;
export const SPOTIFY_PLAYER_PAUSE_URI = `${SPOTIFY_PLAYER_URI}/pause`;
export const SPOTIFY_PLAYER_PLAY_URI = `${SPOTIFY_PLAYER_URI}/play`;
export const SPOTIFY_PLAYER_NEXT_URI = `${SPOTIFY_PLAYER_URI}/next`;
export const SPOTIFY_PLAYER_PREVIOUS_URI = `${SPOTIFY_PLAYER_URI}/previous`;
export const SPOTIFY_PLAYER_QUEUE_URI = `${SPOTIFY_PLAYER_URI}/queue`;
export const SPOTIFY_ALBUM_TRACKS = `${SPOTIFY_API_URI}/v1/albums/{id}/tracks`;

export const STORAGE_AUTH_CODE_VERIFIER = 'SR_AUTH_CODE_VERIFIER';
export const STORAGE_AUTH_STATE = 'SR_AUTH_STATE';
export const STORAGE_TOKEN = 'SR_TOKEN';
export const STORAGE_VIEW_SETTINGS = 'SR_VIEW_SETTINGS';
