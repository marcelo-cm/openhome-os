'use server';

import {
  TClothingItem,
  TCreateClothingItem,
  TUpdateClothingItem,
} from '@openhome-os/core/models/clothing-item/clothing-item-types';

import ClothingItemService from './clothing-item-service';

// Create
export async function createClothingItem({
  data,
}: {
  data: TCreateClothingItem;
}): Promise<TClothingItem | undefined> {
  try {
    const [clothingItem] = await ClothingItemService.createClothingItem({
      clothingItem: data,
    });

    return clothingItem;
  } catch (error) {
    console.error('[createClothingItem]', error);
    throw new Error('Failed to create ClothingItem');
  }
}

// Read (Get All)
export async function getClothingItems(): Promise<TClothingItem[]> {
  try {
    const clothingItems = await ClothingItemService.getAllClothingItem();

    return clothingItems;
  } catch (error) {
    console.error('[getClothingItems]', error);
    throw new Error('Failed to get ClothingItems');
  }
}

// Read (Get)
export async function getClothingItem({
  id,
}: {
  id: string;
}): Promise<TClothingItem> {
  try {
    const clothingItem = await ClothingItemService.getClothingItem({ id });

    if (!clothingItem) {
      throw new Error('ClothingItem not found');
    }

    return clothingItem;
  } catch (error) {
    console.error('[getClothingItem]', error);
    throw new Error('Failed to get ClothingItem');
  }
}

// Update
export async function updateClothingItem({
  id,
  data,
}: {
  id: string;
  data: TUpdateClothingItem;
}): Promise<TClothingItem> {
  try {
    const [clothingItem] = await ClothingItemService.updateClothingItem({
      id,
      clothingItem: data,
    });

    if (!clothingItem) {
      throw new Error('ClothingItem not found');
    }

    return clothingItem;
  } catch (error) {
    console.error('[updateClothingItem]', error);
    throw new Error('Failed to update ClothingItem');
  }
}

// Delete
export async function deleteClothingItem({
  id,
}: {
  id: string;
}): Promise<TClothingItem> {
  try {
    const [clothingItem] = await ClothingItemService.deleteClothingItem({ id });

    if (!clothingItem) {
      throw new Error('ClothingItem not found');
    }

    return clothingItem;
  } catch (error) {
    console.error('[deleteClothingItem]', error);
    throw new Error('Failed to delete ClothingItem');
  }
}
