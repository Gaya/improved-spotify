export const APP_URI = process.env.REACT_APP_URI || '';
export const SPOTIFY_REDIRECT_URI = `${APP_URI}/auth`;
export const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '';
export const SPOTIFY_ACCOUNT_URI = 'https://accounts.spotify.com';
export const SPOTIFY_AUTH_URI = `${SPOTIFY_ACCOUNT_URI}/authorize`;
export const STORAGE_AUTH_CODE_VERIFIER = 'IS_AUTH_CODE_VERIFIER';
export const STORAGE_AUTH_STATE = 'IS_AUTH_STATE';
export const SPOTIFY_TOKEN_URI = `${SPOTIFY_ACCOUNT_URI}/api/token`;
