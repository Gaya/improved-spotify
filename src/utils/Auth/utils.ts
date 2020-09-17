import {
  SPOTIFY_AUTH_URI,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI, SPOTIFY_TOKEN_URI,
  STORAGE_AUTH_CODE_VERIFIER,
  STORAGE_AUTH_STATE,
  STORAGE_TOKEN,
} from '../../consts';
import { urlWithQueryString } from '../request';

export function generateRandomString(length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function createCodeVerifier(): string {
  return generateRandomString(128);
}

function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);

  return new Promise((resolve) => window.crypto.subtle.digest('SHA-256', data).then(resolve));
}

function base64urlencode(arrayBuffer: ArrayBuffer): string {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(arrayBuffer))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function createCodeChallenge(codeVerifier: string): Promise<string> {
  return sha256(codeVerifier)
    .then((hashed) => base64urlencode(hashed));
}

export function getStoredCodeVerifier(): string | null {
  return localStorage.getItem(STORAGE_AUTH_CODE_VERIFIER);
}

export function getStoredState(): string | null {
  return localStorage.getItem(STORAGE_AUTH_STATE);
}

export function wipeAuthStorage(): void {
  localStorage.removeItem(STORAGE_AUTH_CODE_VERIFIER);
  localStorage.removeItem(STORAGE_AUTH_STATE);
  localStorage.removeItem(STORAGE_TOKEN);
}

interface AuthStrings {
  codeChallenge: string;
  state: string;
}

export function createAuthStrings(): Promise<AuthStrings> {
  const hasInStorage = getStoredCodeVerifier() !== null
    && getStoredState() !== null;

  const codeVerifier: string = getStoredCodeVerifier() || generateRandomString(128);
  const state: string = getStoredState() || generateRandomString(32);

  if (!hasInStorage) {
    localStorage.setItem(STORAGE_AUTH_CODE_VERIFIER, codeVerifier);
    localStorage.setItem(STORAGE_AUTH_STATE, state);
  }

  return createCodeChallenge(codeVerifier)
    .then((codeChallenge) => ({
      codeChallenge,
      state,
    }));
}

function getAuthScopes(): string {
  const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
  ];

  return scopes.join(' ');
}

export function createAuthUrl(codeChallenge: string, state: string): string {
  return urlWithQueryString(
    SPOTIFY_AUTH_URI,
    {
      /* eslint-disable @typescript-eslint/camelcase */
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      state,
      scope: getAuthScopes(),
      /* eslint-enable @typescript-eslint/camelcase */
    },
  );
}

interface AuthToken {
  access_token: string;
  token_type: 'Bearer';
  scope: string;
  expires_in: number;
  refresh_token: string;
}

interface StoredToken extends AuthToken {
  received: number;
}

function storeToken(token: AuthToken): void {
  const toBeStored: StoredToken = { ...token, received: +new Date() };

  localStorage.setItem(STORAGE_TOKEN, JSON.stringify(toBeStored));
}

export function getStoredToken(): StoredToken {
  const token = localStorage.getItem(STORAGE_TOKEN);

  if (!token) {
    throw new Error('No stored token');
  }

  return JSON.parse(token);
}

export function authWithAuthorizationCode(code: string): Promise<void> {
  const codeVerifier = getStoredCodeVerifier() || '';

  const body = new URLSearchParams();
  body.set('client_id', SPOTIFY_CLIENT_ID);
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', SPOTIFY_REDIRECT_URI);
  body.set('code_verifier', codeVerifier);

  return fetch(
    SPOTIFY_TOKEN_URI,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((response) => storeToken(response));
}

export function hasToken(): boolean {
  return localStorage.getItem(STORAGE_TOKEN) !== null;
}
