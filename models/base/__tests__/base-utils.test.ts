import { buildMany } from '@/models/base/base-utils';

describe('buildMany', () => {
  it('builds correct number of items', () => {
    const items = buildMany((i) => i, 5);
    expect(items).toEqual([0, 1, 2, 3, 4]);
  });

  it('returns empty array when count <= 0', () => {
    expect(buildMany(() => 1, 0)).toEqual([]);
    expect(buildMany(() => 1, -3)).toEqual([]);
  });
});
