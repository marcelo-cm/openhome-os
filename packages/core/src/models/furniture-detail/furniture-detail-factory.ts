import { faker } from '@faker-js/faker';

import { buildMany } from '../base/base-utils';
import type { TFurnitureDetail } from './furniture-detail-types';

export function buildFakeFurnitureDetail(
  options: { override?: Partial<TFurnitureDetail> } = {},
): TFurnitureDetail {
  const { override } = options;
  const detail: TFurnitureDetail = {
    item_id: faker.string.uuid(),
    dimensions: {
      width: faker.number.float({ min: 20, max: 300, fractionDigits: 1 }),
      height: faker.number.float({ min: 20, max: 300, fractionDigits: 1 }),
      depth: faker.number.float({ min: 20, max: 200, fractionDigits: 1 }),
      unit: faker.helpers.arrayElement(['cm', 'in'] as const),
    },
  };
  return { ...detail, ...override };
}

export function buildFakeFurnitureDetails(
  count = 1,
  optionsFactory?: (index: number) => { override?: Partial<TFurnitureDetail> },
): TFurnitureDetail[] {
  return buildMany(
    (index) => buildFakeFurnitureDetail(optionsFactory?.(index)),
    count,
  );
}

export default buildFakeFurnitureDetail;
