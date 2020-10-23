import { post, urlWithQueryString } from '../../utils/request';

import {
  SPOTIFY_AUTH_URI,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI, SPOTIFY_TOKEN_URI,
  STORAGE_AUTH_CODE_VERIFIER,
  STORAGE_AUTH_STATE,
  STORAGE_TOKEN,
} from '../../consts';
import {
  AuthToken,
  StoredAuthToken,
} from '../../types';

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
    'user-read-email',
    'user-read-private',
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

export function getStoredToken(): StoredAuthToken {
  const token = localStorage.getItem(STORAGE_TOKEN);

  if (!token) {
    throw new Error('No stored token');
  }

  return JSON.parse(token);
}

export function hasToken(): boolean {
  return localStorage.getItem(STORAGE_TOKEN) !== null;
}

export function getValidToken(): Promise<AuthToken> {
  const token = getStoredToken();

  if (token.received + (token.expires_in * 100) < +new Date()) {
    return refreshToken(token);
  }

  return Promise.resolve(token);
}

function storeToken(token: AuthToken): void {
  const toBeStored: StoredAuthToken = { ...token, received: +new Date() };

  localStorage.setItem(STORAGE_TOKEN, JSON.stringify(toBeStored));
}

function performAuthentication(data: PostData): Promise<AuthToken> {
  return post(SPOTIFY_TOKEN_URI, data, ContentType.formUrlEncoded)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((response: AuthToken) => {
      storeToken(response);
      return response;
    });
}

let currentTokenRefresh: Promise<AuthToken> | undefined;

function refreshToken(authToken: StoredAuthToken): Promise<AuthToken> {
  if (!currentTokenRefresh) {
    currentTokenRefresh = performAuthentication({
      /* eslint-disable @typescript-eslint/camelcase */
      grant_type: 'refresh_token',
      refresh_token: authToken.refresh_token,
      client_id: SPOTIFY_CLIENT_ID,
      /* eslint-enable @typescript-eslint/camelcase */
    }).then((token) => {
      currentTokenRefresh = undefined;
      return token;
    });
  }

  return currentTokenRefresh;
}

export function authenticateWithAuthorizationCode(code: string): Promise<AuthToken> {
  const codeVerifier = getStoredCodeVerifier() || '';

  return performAuthentication({
    /* eslint-disable @typescript-eslint/camelcase */
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: 'authorization_code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    code,
    code_verifier: codeVerifier,
    /* eslint-enable @typescript-eslint/camelcase */
  });
}
