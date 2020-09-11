interface QueryStringData {
  [key: string]: string;
}

export function urlWithQueryString(url: string, data?: QueryStringData): string {
  if (!data) {
    return url;
  }

  const queryString = Object.keys(data).sort().map((key: string) => [
    key,
    encodeURIComponent(data[key]),
  ].join('=')).join('&');

  return [
    url,
    '?',
    queryString,
  ].join('');
}
