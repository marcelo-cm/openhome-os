import { faker } from '@faker-js/faker';

import { buildMany } from '../base/base-utils';
import type { TPersonalItemDetail } from './personal-item-detail-types';

export function buildFakePersonalItemDetail(
  options: { override?: Partial<TPersonalItemDetail> } = {},
): TPersonalItemDetail {
  const { override } = options;
  const detail: TPersonalItemDetail = {
    item_id: faker.string.uuid(),
    material: faker.helpers.arrayElement([
      'aluminum',
      'plastic',
      'bamboo',
      'steel',
      'silicone',
      'wood',
    ]),
    replacement_cycle_days: faker.helpers.arrayElement([
      30,
      60,
      90,
      180,
      365,
      null,
    ]),
  };
  return { ...detail, ...override };
}

export function buildFakePersonalItemDetails(
  count = 1,
  optionsFactory?: (index: number) => {
    override?: Partial<TPersonalItemDetail>;
  },
): TPersonalItemDetail[] {
  return buildMany(
    (index) => buildFakePersonalItemDetail(optionsFactory?.(index)),
    count,
  );
}

export default buildFakePersonalItemDetail;
