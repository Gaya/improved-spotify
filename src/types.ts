export interface Loadable {
  isLoading: boolean;
  isResolving: boolean;
  error?: Error;
}

export enum ContentType {
  json = 'application/json',
  formUrlEncoded = 'application/x-www-form-urlencoded',
}

export interface QueryStringData {
  [key: string]: string;
}

export interface PostData {
  [key: string]: string | number | boolean;
}

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
