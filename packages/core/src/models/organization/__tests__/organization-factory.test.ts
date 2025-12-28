import {
  buildFakeOrganization,
  buildFakeOrganizations,
} from '@openhome-os/core/models/organization/organization-factory';

describe('organization-factory', () => {
  it('builds an organization with base and org-specific fields', () => {
    const org = buildFakeOrganization();
    expect(typeof org.id).toBe('string');
    expect(typeof org.name).toBe('string');
    expect(typeof org.tier).toBe('string');
  });

  it('applies baseOverride and override with correct precedence', () => {
    const org = buildFakeOrganization({
      baseOverride: { id: 'final-id' },
      override: { name: 'Acme' },
    });
    expect(org.id).toBe('final-id');
    expect(org.name).toBe('Acme');
  });

  it('builds many organizations and allows per-index overrides', () => {
    const orgs = buildFakeOrganizations(2, (i) => ({
      override: { name: `Org ${i}` },
    }));
    expect(orgs).toHaveLength(2);
    expect(orgs[0]?.name).toBe('Org 0');
    expect(orgs[1]?.name).toBe('Org 1');
  });
});
