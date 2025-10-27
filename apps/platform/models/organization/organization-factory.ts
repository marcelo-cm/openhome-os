import { faker } from '@faker-js/faker';

import { RbacRole } from '@/permissions/rbac-enums';

import buildFakeBase from '../base/base-factory';
import type { TBaseModel, TWithoutBaseModel } from '../base/base-types';
import { buildMany } from '../base/base-utils';
import { OrganizationTier } from './organization-enums';
import type {
  TOrganization,
  TOrganizationMembership,
} from './organization-types';

export function buildFakeOrganization(
  options: {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TOrganization>>;
  } = {},
): TOrganization {
  const { baseOverride, override } = options;
  const base = buildFakeBase(baseOverride);
  const organization: TOrganization = {
    ...base,
    name: faker.company.name(),
    logo_url: faker.image.url(),
    tier: faker.helpers.enumValue(OrganizationTier),
  };

  return { ...organization, ...override };
}

export function buildFakeOrganizations(
  count = 1,
  optionsFactory?: (index: number) => {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TOrganization>>;
  },
): TOrganization[] {
  return buildMany(
    (index) => buildFakeOrganization(optionsFactory?.(index)),
    count,
  );
}

export function buildFakeOrganizationMembership(
  options: {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TOrganizationMembership>>;
  } = {},
): TOrganizationMembership {
  const { baseOverride, override } = options;
  const base = buildFakeBase(baseOverride);
  const organization: TOrganizationMembership = {
    ...base,
    principal_id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    organization_id: faker.string.uuid(),
    rbac_role: faker.helpers.enumValue(RbacRole),
  };

  return {
    ...organization,
    ...override,
  };
}

export function buildFakeOrganizationMemberships(
  count = 1,
  optionsFactory?: (index: number) => {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TOrganizationMembership>>;
  },
): TOrganizationMembership[] {
  return buildMany(
    (index) => buildFakeOrganizationMembership(optionsFactory?.(index)),
    count,
  );
}

export default buildFakeOrganization;
