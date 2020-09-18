import { getValidToken } from './Auth/utils';
import { get as GET, post as POST } from './request';

import { ContentType, PostData, QueryStringData } from '../types';

export const get = (
  uri: string,
  params: QueryStringData = {},
): Promise<Response> => getValidToken()
  .then((token) => GET(uri, params, token.access_token));

export const post = (
  uri: string,
  data: PostData = {},
  contentType: ContentType = ContentType.json,
): Promise<Response> => getValidToken()
  .then((token) => POST(uri, data, contentType, token.access_token));
