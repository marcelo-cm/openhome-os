import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { clothingItems } from '@/db/db-schema';
import {
  TClothingItem,
  TCreateClothingItem,
  TUpdateClothingItem,
} from '@/models/clothing-item/clothing-item-types';

/**
 * Interactions with the database for ClothingItem
 */
const ClothingItemService = {
  /**
   * @description Create a clothing item
   * @param clothingItem - The clothing item to create
   * @returns The created clothing item
   */
  createClothingItem: async ({
    clothingItem,
  }: {
    clothingItem: TCreateClothingItem;
  }): Promise<TClothingItem[]> => {
    return db.insert(clothingItems).values(clothingItem).returning();
  },
  /**
   * @description Get a clothing item by their ID
   * @param id - The ID of the clothing item to get
   * @returns The clothing item with the given ID
   */
  getClothingItem: async ({
    id,
  }: {
    id: string;
  }): Promise<TClothingItem | undefined> => {
    return db.query.clothingItems.findFirst({
      where: eq(clothingItems.id, id),
    });
  },
  /**
   * @description Get all clothing items
   * @returns All clothing items
   */
  getAllClothingItem: async (): Promise<TClothingItem[]> => {
    return db.query.clothingItems.findMany();
  },
  /**
   * @description Update a clothing item by their ID
   * @param id - The ID of the clothing item to update
   * @param clothingItem - The clothing item to update
   * @returns The updated clothing item
   */
  updateClothingItem: async ({
    id,
    clothingItem,
  }: {
    id: string;
    clothingItem: TUpdateClothingItem;
  }): Promise<TClothingItem[]> => {
    return db
      .update(clothingItems)
      .set(clothingItem)
      .where(eq(clothingItems.id, id))
      .returning();
  },
  /**
   * @description Delete a clothing item by their ID
   * @param id - The ID of the clothing item to delete
   * @returns The deleted clothing item
   */
  deleteClothingItem: async ({
    id,
  }: {
    id: string;
  }): Promise<TClothingItem[]> => {
    return db.delete(clothingItems).where(eq(clothingItems.id, id)).returning();
  },
};

export default ClothingItemService;
