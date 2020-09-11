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
