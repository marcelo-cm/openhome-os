import { faker } from '@faker-js/faker';

import { RbacRole } from '@/permissions/rbac-enums';

import buildFakeBase from '../base/base-factory';
import type { TBaseModel, TWithoutBaseModel } from '../base/base-types';
import { buildMany } from '../base/base-utils';
import type { TLocation, TLocationMembership } from './location-types';

export function buildFakeLocation(
  options: {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TLocation>>;
  } = {},
): TLocation {
  const { baseOverride, override } = options;
  const base = buildFakeBase(baseOverride);
  const location: TLocation = {
    ...base,
    name: faker.company.name(),
    project_id: faker.string.uuid(),
  };

  return { ...location, ...override };
}

export function buildFakeLocations(
  count = 1,
  optionsFactory?: (index: number) => {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TLocation>>;
  },
): TLocation[] {
  return buildMany(
    (index) => buildFakeLocation(optionsFactory?.(index)),
    count,
  );
}

export function buildFakeLocationMembership(
  options: {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TLocationMembership>>;
  } = {},
): TLocationMembership {
  const { baseOverride, override } = options;
  const base = buildFakeBase(baseOverride);
  const location: TLocationMembership = {
    ...base,
    principal_id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    location_id: faker.string.uuid(),
    rbac_role: faker.helpers.enumValue(RbacRole),
  };

  return {
    ...location,
    ...override,
  };
}

export function buildFakeLocationMemberships(
  count = 1,
  optionsFactory?: (index: number) => {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TLocationMembership>>;
  },
): TLocationMembership[] {
  return buildMany(
    (index) => buildFakeLocationMembership(optionsFactory?.(index)),
    count,
  );
}

export default buildFakeLocation;
