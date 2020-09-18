export interface Loadable {
  isLoading: boolean;
  isResolving: boolean;
  error?: Error;
}

export enum ContentType {
  json = 'application/json',
  formUrlEncoded = 'application/x-www-form-urlencoded',
}
