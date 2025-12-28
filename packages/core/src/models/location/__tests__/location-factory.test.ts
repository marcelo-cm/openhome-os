import {
  buildFakeLocation,
  buildFakeLocations,
} from '@openhome-os/core/models/location/location-factory';

describe('location-factory', () => {
  it('builds an location with base and location-specific fields', () => {
    const location = buildFakeLocation();
    expect(typeof location.id).toBe('string');
    expect(typeof location.name).toBe('string');
  });

  it('applies baseOverride and override with correct precedence', () => {
    const location = buildFakeLocation({
      baseOverride: { id: 'final-id' },
      override: { name: 'Acme' },
    });
    expect(location.id).toBe('final-id');
    expect(location.name).toBe('Acme');
  });

  it('builds many locations and allows per-index overrides', () => {
    const locations = buildFakeLocations(2, (i) => ({
      override: { name: `Location ${i}` },
    }));
    expect(locations).toHaveLength(2);
    expect(locations[0]?.name).toBe('Location 0');
    expect(locations[1]?.name).toBe('Location 1');
  });
});
