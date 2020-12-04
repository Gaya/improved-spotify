import { getValidToken } from '../components/Auth/utils';
import { ContentType } from '../enums';

import { get as getPlain, post as postPlain, getPaged as getPagedPlain } from './request';

function parseResponse<S>(response: Response): Promise<S> {
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.indexOf('application/json') === 0) {
    return response.json();
  }

  throw new Error('No content');
}

export const get = <S>(
  uri: string,
  params: QueryStringData = {},
): Promise<S> => getValidToken()
    .then((token) => getPlain(uri, params, token.access_token))
    .then((response) => parseResponse<S>(response));

export const getPaged = <T>(
  uri: string,
  params: QueryStringData = {},
): Promise<T[]> => getValidToken()
    .then((token) => getPagedPlain<T>(uri, params, token.access_token));

export const postWithoutParsing = (
  uri: string,
  data: PostData = {},
  contentType: ContentType = ContentType.json,
  method = 'POST',
): Promise<Response> => getValidToken().then((token) => postPlain(
  uri,
  data,
  contentType,
  token.access_token,
  method,
));

export const post = <S>(
  uri: string,
  data: PostData = {},
  contentType: ContentType = ContentType.json,
): Promise<S> => postWithoutParsing(uri,
    data,
    contentType).then((response) => parseResponse<S>(response));

export const putWithoutParsing = (
  uri: string,
  data: PostData = {},
  contentType: ContentType = ContentType.json,
): Promise<Response> => postWithoutParsing(uri, data, contentType, 'PUT');
