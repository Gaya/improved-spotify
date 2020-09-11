import SHA256 from 'crypto-js/sha256';

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

interface AuthStrings {
  codeChallenge: string;
  codeVerifier: string;
  state: string;
}

export function createAuthStrings(): AuthStrings {
  const codeVerifier = generateRandomString(128);
  const state = generateRandomString(32);

  return {
    codeChallenge: createCodeChallenge(codeVerifier),
    codeVerifier,
    state,
  };
}
