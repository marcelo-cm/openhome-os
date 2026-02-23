import { ItemCategory } from '@openhome-os/core/models/item/item-enums';

export interface HomeCategoryConfig {
  title: string;
  description: string;
}

export const HOME_CATEGORY_CONFIG: Record<ItemCategory, HomeCategoryConfig> = {
  [ItemCategory.PERSONAL]: {
    title: 'Personal',
    description: 'Manage your personal items.',
  },
  [ItemCategory.CLOTHING]: {
    title: 'Clothing',
    description: 'Manage your clothing items.',
  },
  [ItemCategory.HOME]: {
    title: 'Home',
    description: 'Manage your home items.',
  },
  [ItemCategory.DEVICE]: {
    title: 'Devices',
    description: 'Manage your devices.',
  },
  [ItemCategory.FURNITURE]: {
    title: 'Furniture',
    description: 'Manage your furniture.',
  },
};
