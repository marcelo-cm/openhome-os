import { ClothingItemStatus } from '@/models/clothing-item/clothing-item-enums';
import { ClothingPrivacy } from '@/models/clothing-item/clothing-item-enums';
import {
  buildFakeClothingItem,
  buildFakeClothingItems,
} from '@/models/clothing-item/clothing-item-factory';

describe('clothing-item-factory', () => {
  it('builds a clothing item with base and clothing-item-specific fields', () => {
    const clothingItem = buildFakeClothingItem();
    expect(typeof clothingItem.id).toBe('string');
    expect(typeof clothingItem.name).toBe('string');
    expect(typeof clothingItem.principal_id).toBe('string');
    expect(typeof clothingItem.location_id).toBe('string');
    expect(Object.values(ClothingPrivacy)).toContain(clothingItem.privacy);
    expect(Object.values(ClothingItemStatus)).toContain(clothingItem.status);
  });

  it('applies baseOverride and override with correct precedence', () => {
    const clothingItem = buildFakeClothingItem({
      baseOverride: { id: 'final-id' },
      override: { name: 'Test Shirt', brand: 'Nike' },
    });
    expect(clothingItem.id).toBe('final-id');
    expect(clothingItem.name).toBe('Test Shirt');
    expect(clothingItem.brand).toBe('Nike');
  });

  it('builds many clothing items and allows per-index overrides', () => {
    const clothingItems = buildFakeClothingItems(2, (i) => ({
      override: { name: `Item ${i}` },
    }));
    expect(clothingItems).toHaveLength(2);
    expect(clothingItems[0]?.name).toBe('Item 0');
    expect(clothingItems[1]?.name).toBe('Item 1');
  });

  it('includes all clothing item fields', () => {
    const clothingItem = buildFakeClothingItem();
    expect(clothingItem).toHaveProperty('principal_id');
    expect(clothingItem).toHaveProperty('name');
    expect(clothingItem).toHaveProperty('description');
    expect(clothingItem).toHaveProperty('size');
    expect(clothingItem).toHaveProperty('base_color');
    expect(clothingItem).toHaveProperty('care_instructions');
    expect(clothingItem).toHaveProperty('brand');
    expect(clothingItem).toHaveProperty('notes');
    expect(clothingItem).toHaveProperty('ai_metadata');
    expect(clothingItem).toHaveProperty('purchase_price');
    expect(clothingItem).toHaveProperty('purchase_date');
    expect(clothingItem).toHaveProperty('location_id');
    expect(clothingItem).toHaveProperty('privacy');
    expect(clothingItem).toHaveProperty('status');
  });

  it('generates valid enum values', () => {
    const clothingItem = buildFakeClothingItem();
    expect(Object.values(ClothingPrivacy)).toContain(clothingItem.privacy);
    expect(Object.values(ClothingItemStatus)).toContain(clothingItem.status);
  });

  it('generates valid size values', () => {
    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const clothingItem = buildFakeClothingItem();
    expect(validSizes).toContain(clothingItem.size);
  });

  it('allows overriding enum values', () => {
    const clothingItem = buildFakeClothingItem({
      override: {
        privacy: ClothingPrivacy.PUBLIC,
        status: ClothingItemStatus.ACTIVE,
      },
    });
    expect(clothingItem.privacy).toBe(ClothingPrivacy.PUBLIC);
    expect(clothingItem.status).toBe(ClothingItemStatus.ACTIVE);
  });
});
