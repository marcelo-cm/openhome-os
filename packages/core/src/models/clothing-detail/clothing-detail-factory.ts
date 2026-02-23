import { faker } from '@faker-js/faker';

import { buildMany } from '../base/base-utils';
import type { TClothingDetail } from './clothing-detail-types';

export function buildFakeClothingDetail(
  options: {
    override?: Partial<TClothingDetail>;
  } = {},
): TClothingDetail {
  const { override } = options;
  const detail: TClothingDetail = {
    item_id: faker.string.uuid(),
    size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    material: faker.helpers.arrayElement([
      'cotton',
      'polyester',
      'wool',
      'silk',
      'linen',
      'denim',
    ]),
    care_instructions: faker.lorem.sentence(),
  };

  return { ...detail, ...override };
}

export function buildFakeClothingDetails(
  count = 1,
  optionsFactory?: (index: number) => {
    override?: Partial<TClothingDetail>;
  },
): TClothingDetail[] {
  return buildMany(
    (index) => buildFakeClothingDetail(optionsFactory?.(index)),
    count,
  );
}

export default buildFakeClothingDetail;
