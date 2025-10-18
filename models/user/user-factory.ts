import { faker } from '@faker-js/faker';

import buildFakeBase from '../base/base-factory';
import type { TBaseModel, TWithoutBaseModel } from '../base/base-types';
import { buildMany } from '../base/base-utils';
import { UserRole } from './user-enums';
import type { TUser } from './user-types';

export function buildFakeUser(
  options: {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TUser>>;
  } = {},
): TUser {
  const { baseOverride, override } = options;

  const base = buildFakeBase(baseOverride);
  const user: TUser = {
    ...base,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    role: faker.helpers.enumValue(UserRole),
    organization_id: faker.string.uuid(),
  };

  return { ...user, ...override };
}

export function buildFakeUsers(
  count = 1,
  optionsFactory?: (index: number) => {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TUser>>;
  },
): TUser[] {
  return buildMany((index) => buildFakeUser(optionsFactory?.(index)), count);
}

export default buildFakeUser;
