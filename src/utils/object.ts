export function deepCopy<T>(src: T): T {
  return JSON.parse(JSON.stringify(src));
}

export function uniqueArray<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
