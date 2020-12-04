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

    const expectedQueryString = 'another=value&key=this+value&test=hello';

    expect(
      urlWithQueryString(baseUrl, data),
    ).toEqual(
      [`${baseUrl}/`, expectedQueryString].join('?'),
    );
  });

  it('should merge with already supplied query strings', () => {
    const data = {
      limit: 5,
      test: 'hello',
    };

    const expectedQueryString = 'limit=5&offset=5&test=hello';

    expect(
      urlWithQueryString(`${baseUrl}/path?limit=5&offset=5`, data),
    ).toEqual(
      [`${baseUrl}/path`, expectedQueryString].join('?'),
    );
  });

  it('should ignore undefined properties', () => {
    const data = {
      deviceId: undefined,
      test: 'hello',
    };

    const expectedQueryString = 'test=hello';

    expect(
      urlWithQueryString(`${baseUrl}/path`, data),
    ).toEqual(
      [`${baseUrl}/path`, expectedQueryString].join('?'),
    );
  });
});
