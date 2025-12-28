import {
  buildFakeUser,
  buildFakeUsers,
} from '@openhome-os/core/models/user/user-factory';

describe('user-factory', () => {
  it('builds a user with base fields and user-specific fields', () => {
    const user = buildFakeUser();
    expect(typeof user.id).toBe('string');
    expect(typeof user.first_name).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.role).toBe('string');
    expect(typeof user.organization_id).toBe('string');
  });

  it('applies baseOverride and override with correct precedence (override wins)', () => {
    const user = buildFakeUser({
      baseOverride: { id: 'final-id' },
      override: { email: 'x@example.com' },
    });
    expect(user.id).toBe('final-id');
    expect(user.email).toBe('x@example.com');
  });

  it('builds many users and allows per-index overrides', () => {
    const users = buildFakeUsers(3, (i) => ({
      override: { email: `user+${i}@example.com` },
    }));
    expect(users).toHaveLength(3);
    expect(users[0]?.email).toBe('user+0@example.com');
    expect(users[1]?.email).toBe('user+1@example.com');
    expect(users[2]?.email).toBe('user+2@example.com');
  });
});
