declare global {
  enum ContentType {
    json = 'application/json',
    formUrlEncoded = 'application/x-www-form-urlencoded',
  }

  interface PagedResponse<S> {
    href: string;
    items: S[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  }

  interface QueryStringData {
    [key: string]: string | number | boolean;
  }

  interface PostData {
    [key: string]: string | number | boolean | string[] | undefined;
  }
}

export {};
