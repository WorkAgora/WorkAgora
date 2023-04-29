interface HashConfig {
  padLeft?: number;
  padRight?: number;
  separator?: string;
}

export function shortHash(hash?: string, config?: HashConfig) {
  const { padLeft = 4, padRight = 4, separator = '...' } = config || {};
  if (!hash) return '';

  const minLength = padLeft + padRight + separator.length;
  if (hash.length <= minLength) return hash;

  const head = hash.substring(0, padLeft);
  const tail = hash.substring(hash.length - padRight);
  return `${head}${separator}${tail}`;
}
