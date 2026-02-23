import { faker } from '@faker-js/faker';

import { buildMany } from '../base/base-utils';
import type { THomeItemDetail } from './home-item-detail-types';

export function buildFakeHomeItemDetail(
  options: { override?: Partial<THomeItemDetail> } = {},
): THomeItemDetail {
  const { override } = options;
  const detail: THomeItemDetail = {
    item_id: faker.string.uuid(),
    model_number: faker.string.alphanumeric(10).toUpperCase(),
    warranty_expiration: faker.date.future().toISOString(),
    dimensions: {
      width: faker.number.float({ min: 5, max: 200, fractionDigits: 1 }),
      height: faker.number.float({ min: 5, max: 200, fractionDigits: 1 }),
      depth: faker.number.float({ min: 5, max: 100, fractionDigits: 1 }),
      unit: faker.helpers.arrayElement(['cm', 'in'] as const),
    },
  };
  return { ...detail, ...override };
}

export function buildFakeHomeItemDetails(
  count = 1,
  optionsFactory?: (index: number) => { override?: Partial<THomeItemDetail> },
): THomeItemDetail[] {
  return buildMany(
    (index) => buildFakeHomeItemDetail(optionsFactory?.(index)),
    count,
  );
}

export default buildFakeHomeItemDetail;
