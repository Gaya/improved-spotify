/* eslint-disable camelcase */

declare global {
  interface AuthToken {
    access_token: string;
    token_type: 'Bearer';
    scope: string;
    expires_in: number;
    refresh_token: string;
  }

  interface StoredAuthToken extends AuthToken {
    received: number;
  }
}

export {};
