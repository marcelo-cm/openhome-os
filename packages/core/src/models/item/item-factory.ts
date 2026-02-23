import { faker } from '@faker-js/faker';
import {
  ItemCategory,
  ItemPrivacy,
  ItemStatus,
} from '@openhome-os/core/models/item/item-enums';

import buildFakeBase from '../base/base-factory';
import type { TBaseModel, TWithoutBaseModel } from '../base/base-types';
import { buildMany } from '../base/base-utils';
import type { TItem } from './item-types';

export function buildFakeItem(
  options: {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TItem>>;
  } = {},
): TItem {
  const { baseOverride, override } = options;
  const base = buildFakeBase(baseOverride);
  const item: TItem = {
    ...base,
    category: faker.helpers.enumValue(ItemCategory),
    principal_id: faker.string.uuid(),
    location_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    brand: faker.company.name(),
    base_color: faker.color.human(),
    notes: faker.lorem.paragraph(),
    purchase_price: faker.commerce.price(),
    purchase_date: faker.date.past().toISOString().slice(0, 10),
    status: faker.helpers.enumValue(ItemStatus),
    privacy: faker.helpers.enumValue(ItemPrivacy),
  };

  return { ...item, ...override };
}

export function buildFakeItems(
  count = 1,
  optionsFactory?: (index: number) => {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TItem>>;
  },
): TItem[] {
  return buildMany((index) => buildFakeItem(optionsFactory?.(index)), count);
}

export default buildFakeItem;
