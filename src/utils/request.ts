import {
  ContentType,
  PagedResponse,
  PostData,
  QueryStringData,
} from '../types';

export function urlWithQueryString(url: string, data?: QueryStringData): string {
  if (!data || Object.keys(data).length === 0) {
    return url;
  }

  const parsed = new URL(url);

  return [
    parsed.origin,
    parsed.pathname,
    '?',
    dataToQueryString(data, parsed.search),
  ].join('');
}

export function dataToQueryString(data: QueryStringData, baseUrl = ''): string {
  const searchParams = new URLSearchParams(baseUrl);

  Object.keys(data).sort().forEach((key: string) => {
    searchParams.set(key, data[key].toString());
  });

  return searchParams.toString();
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
  method = 'POST',
): Promise<Response> {
  return fetch(
    uri,
    {
      method,
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

export function getPaged<T>(
  uri: string,
  params: QueryStringData = {},
  accessToken?: string,
  currentItems: T[] = [],
): Promise<T[]> {
  return get(uri, params, accessToken)
    .then((response) => response.json())
    .then((response: PagedResponse<T>) => {
      if (response.next) {
        return getPaged<T>(
          response.next,
          params,
          accessToken,
          [...currentItems, ...response.items],
        );
      }

      return [...currentItems, ...response.items];
    });
}
