import buildFakeBase from '@/models/base/base-factory';

describe('base-factory', () => {
  it('builds a base model with correct types', () => {
    const base = buildFakeBase();

    expect(typeof base.id).toBe('string');
    expect(base.created_at instanceof Date).toBe(true);
    expect(base.updated_at instanceof Date).toBe(true);
    expect(typeof base.is_active).toBe('boolean');
    expect(base.deleted_at === null || base.deleted_at instanceof Date).toBe(
      true,
    );
  });

  it('applies overrides', () => {
    const now = new Date();
    const base = buildFakeBase({
      id: 'fixed-id',
      is_active: false,
      created_at: now,
    });

    expect(base.id).toBe('fixed-id');
    expect(base.is_active).toBe(false);
    expect(base.created_at).toBe(now);
  });
});
