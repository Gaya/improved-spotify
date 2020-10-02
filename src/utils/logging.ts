const enableLogging = true;

export function error(...args: unknown[]): void {
  if (!enableLogging) return;

  // eslint-disable-next-line no-console
  console.error(...args);
}

export function dir(...args: unknown[]): void {
  if (!enableLogging) return;

  // eslint-disable-next-line no-console
  console.dir(...args);
}

export function table(...args: unknown[]): void {
  if (!enableLogging) return;

  // eslint-disable-next-line no-console
  console.table(...args);
}

export function log(...args: unknown[]): void {
  if (!enableLogging) return;

  // eslint-disable-next-line no-console
  console.log(...args);
}

export function info(...args: unknown[]): void {
  if (!enableLogging) return;

  // eslint-disable-next-line no-console
  console.info(...args);
}
