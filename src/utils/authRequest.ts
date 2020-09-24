import { getValidToken } from './Auth/utils';
import { get as getPlain, post as postPlain, getPaged as getPagedPlain } from './request';

import { ContentType, PostData, QueryStringData } from '../types';

export const get = <S>(
  uri: string,
  params: QueryStringData = {},
): Promise<S> => getValidToken()
    .then((token) => getPlain(uri, params, token.access_token))
    .then((response) => response.json());

export const getPaged = <T>(
  uri: string,
  params: QueryStringData = {},
): Promise<T[]> => getValidToken()
    .then((token) => getPagedPlain<T>(uri, params, token.access_token));

export const post = <S>(
  uri: string,
  data: PostData = {},
  contentType: ContentType = ContentType.json,
): Promise<S> => getValidToken()
    .then((token) => postPlain(uri, data, contentType, token.access_token))
    .then((response) => response.json());
