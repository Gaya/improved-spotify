import SHA256 from 'crypto-js/sha256';
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

export function createCodeChallenge(codeVerifier: string): string {
  return btoa(SHA256(codeVerifier).toString());
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

export function createAuthStrings(): AuthStrings {
  const hasInStorage = getStoredCodeVerifier() !== null
    && getStoredState() !== null;

  const codeVerifier: string = getStoredCodeVerifier() || generateRandomString(128);
  const state: string = getStoredState() || generateRandomString(32);

  if (!hasInStorage) {
    localStorage.setItem(STORAGE_AUTH_CODE_VERIFIER, codeVerifier);
    localStorage.setItem(STORAGE_AUTH_STATE, state);
  }

  return {
    codeChallenge: createCodeChallenge(codeVerifier),
    codeVerifier,
    state,
  };
}
