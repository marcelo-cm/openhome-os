import { faker } from '@faker-js/faker';

import { TBaseModel } from './base-types';

const buildFakeBase = (override?: Partial<TBaseModel>): TBaseModel => {
  const base = {
    id: faker.string.uuid(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    is_active: faker.datatype.boolean(),
    deleted_at: null,
  };

  return {
    ...base,
    ...override,
  };
};

export default buildFakeBase;
