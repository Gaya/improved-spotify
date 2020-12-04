declare global {
  interface PagedResponse<T> {
    href: string;
    items: T[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  }

  interface QueryStringData {
    [key: string]: string | number | boolean | undefined;
  }

  interface PostData {
    [key: string]: string | number | boolean | string[] | undefined;
  }
}

export {};
