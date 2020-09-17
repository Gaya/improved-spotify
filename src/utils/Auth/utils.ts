import { STORAGE_AUTH_CODE_VERIFIER, STORAGE_AUTH_STATE } from '../../consts';

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
}

interface AuthStrings {
  codeChallenge: string;
  codeVerifier: string;
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
      codeVerifier,
      state,
    }));
}
