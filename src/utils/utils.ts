

export function undefinedIfEqual<T> (a: T, b: T): T | undefined  {
  return a === b ? undefined : a
}
