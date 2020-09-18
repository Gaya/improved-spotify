import { ContentType, PostData, QueryStringData } from '../types';

export function urlWithQueryString(url: string, data?: QueryStringData): string {
  if (!data || Object.keys(data).length === 0) {
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

interface Headers {
  [key: string]: string;
}

function headersWithAccessToken(headers: Headers, accessToken?: string): Headers {
  return accessToken ? { ...headers, Authorization: `Bearer ${accessToken}` } : headers;
}

export function post(
  uri: string,
  data: PostData = {},
  contentType: ContentType = ContentType.json,
  accessToken?: string,
): Promise<Response> {
  return fetch(
    uri,
    {
      method: 'POST',
      headers: headersWithAccessToken({
        Accept: 'application/json',
        'Content-Type': contentType,
      }, accessToken),
      body: bodyForContentType(data, contentType),
    },
  );
}

export function get(
  uri: string,
  params: QueryStringData = {},
  accessToken?: string,
): Promise<Response> {
  const headers: { [key: string]: string } = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return fetch(
    urlWithQueryString(uri, params),
    {
      method: 'GET',
      headers: headersWithAccessToken({}, accessToken),
    },
  );
}
