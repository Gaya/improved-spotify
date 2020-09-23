import { getValidToken } from './Auth/utils';
import { get as GET, post as POST, getPaged as GETPAGED } from './request';

import { ContentType, PostData, QueryStringData } from '../types';

export const get = <S>(
  uri: string,
  params: QueryStringData = {},
): Promise<S> => getValidToken()
    .then((token) => GET(uri, params, token.access_token))
    .then((response) => response.json());

export const getPaged = <T>(
  uri: string,
  params: QueryStringData = {},
): Promise<T[]> => getValidToken()
    .then((token) => GETPAGED<T>(uri, params, token.access_token));

export const post = <S>(
  uri: string,
  data: PostData = {},
  contentType: ContentType = ContentType.json,
): Promise<S> => getValidToken()
    .then((token) => POST(uri, data, contentType, token.access_token))
    .then((response) => response.json());
