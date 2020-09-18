import { ContentType } from '../types';

interface QueryStringData {
  [key: string]: string;
}

export function urlWithQueryString(url: string, data?: QueryStringData): string {
  if (!data) {
    return url;
  }

  return [
    url,
    '?',
    dataToQueryString(data),
  ].join('');
}

export function dataToQueryString(data: QueryStringData): string {
  return Object.keys(data).sort().map((key: string) => [
    key,
    encodeURI(data[key]),
  ].join('=')).join('&');
}

interface PostData {
  [key: string]: string | number | boolean;
}

function bodyForContentType(data: PostData, contentType: ContentType): string | URLSearchParams {
  switch (contentType) {
    case ContentType.formUrlEncoded: {
      const body = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => body.set(key, value.toString()));
      return body;
    }
    default:
      return JSON.stringify(data);
  }
}

export function post(
  uri: string,
  data: PostData = {},
  contentType: ContentType = ContentType.json,
): Promise<Response> {
  return fetch(
    uri,
    {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: bodyForContentType(data, contentType),
    },
  );
}
