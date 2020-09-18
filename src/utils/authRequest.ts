import { getValidToken } from './Auth/utils';
import { get, post } from './request';

import { ContentType, PostData, QueryStringData } from '../types';

export const authGet = (
  uri: string,
  params: QueryStringData = {},
): Promise<Response> => getValidToken()
  .then((token) => get(uri, params, token.access_token));

export const authPost = (
  uri: string,
  data: PostData = {},
  contentType: ContentType = ContentType.json,
): Promise<Response> => getValidToken()
  .then((token) => post(uri, data, contentType, token.access_token));
