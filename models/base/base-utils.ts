export function buildMany<T>(factory: (index: number) => T, count = 1): T[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, index) => factory(index));
}
