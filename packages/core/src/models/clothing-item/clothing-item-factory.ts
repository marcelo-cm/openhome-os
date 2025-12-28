import { faker } from '@faker-js/faker';
import { ClothingItemStatus } from '@openhome-os/core/models/clothing-item/clothing-item-enums';
import { ClothingPrivacy } from '@openhome-os/core/models/clothing-item/clothing-item-enums';

import buildFakeBase from '../base/base-factory';
import type { TBaseModel, TWithoutBaseModel } from '../base/base-types';
import { buildMany } from '../base/base-utils';
import type { TClothingItem } from './clothing-item-types';

export function buildFakeClothingItem(
  options: {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TClothingItem>>;
  } = {},
): TClothingItem {
  const { baseOverride, override } = options;
  const base = buildFakeBase(baseOverride);
  const clothingItem: TClothingItem = {
    ...base,
    principal_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    base_color: faker.color.human(),
    care_instructions: faker.lorem.sentence(),
    brand: faker.company.name(),
    notes: faker.lorem.paragraph(),
    ai_metadata: null,
    purchase_price: faker.commerce.price(),
    purchase_date: faker.date.past().toISOString(),
    location_id: faker.string.uuid(),
    privacy: faker.helpers.enumValue(ClothingPrivacy),
    status: faker.helpers.enumValue(ClothingItemStatus),
  };

  return { ...clothingItem, ...override };
}

export function buildFakeClothingItems(
  count = 1,
  optionsFactory?: (index: number) => {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TClothingItem>>;
  },
): TClothingItem[] {
  return buildMany(
    (index) => buildFakeClothingItem(optionsFactory?.(index)),
    count,
  );
}

export default buildFakeClothingItem;
