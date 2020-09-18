import { urlWithQueryString } from './request';

describe('urlWithQueryString', () => {
  const baseUrl = 'http://test.com';

  it('should only return url if no data supplied', () => {
    expect(urlWithQueryString(baseUrl)).toEqual(baseUrl);
  });

  it('should only return url with empty data supplied', () => {
    expect(urlWithQueryString(baseUrl, {})).toEqual(baseUrl);
  });

  it('should turn objects into query string', () => {
    const data = {
      key: 'this value',
      test: 'hello',
      another: 'value',
    };

    const expectedQueryString = 'another=value&key=this%20value&test=hello';

    expect(
      urlWithQueryString(baseUrl, data),
    ).toEqual(
      [baseUrl, expectedQueryString].join('?'),
    );
  });
});
