import { Database } from '@openhome-os/core/db/db';
import { clothingItems } from '@openhome-os/core/db/db-schema';
import {
  TClothingItem,
  TCreateClothingItem,
  TUpdateClothingItem,
} from '@openhome-os/core/models/clothing-item/clothing-item-types';
import { eq } from 'drizzle-orm';

import { supportsTransaction } from '../../db/db-utils';

/**
 * Interactions with the database for ClothingItem
 */
const ClothingItemService = {
  /**
   * @description Create a clothing item
   * @param clothingItem - The clothing item to create
   * @returns The created clothing item
   */
  createClothingItem: supportsTransaction(
    async ({
      clothingItem,
      db,
    }: {
      clothingItem: TCreateClothingItem;
      db: Database;
    }): Promise<TClothingItem[]> => {
      return db.insert(clothingItems).values(clothingItem).returning();
    },
  ),
  /**
   * @description Get a clothing item by their ID
   * @param id - The ID of the clothing item to get
   * @returns The clothing item with the given ID
   */
  getClothingItem: supportsTransaction(
    async ({
      id,
      db,
    }: {
      id: string;
      db: Database;
    }): Promise<TClothingItem | undefined> => {
      return db.query.clothingItems.findFirst({
        where: eq(clothingItems.id, id),
      });
    },
  ),
  /**
   * @description Get all clothing items
   * @returns All clothing items
   */
  getAllClothingItem: supportsTransaction(
    async ({ db }: { db: Database }): Promise<TClothingItem[]> => {
      return db.query.clothingItems.findMany();
    },
  ),
  /**
   * @description Update a clothing item by their ID
   * @param id - The ID of the clothing item to update
   * @param clothingItem - The clothing item to update
   * @returns The updated clothing item
   */
  updateClothingItem: supportsTransaction(
    async ({
      id,
      clothingItem,
      db,
    }: {
      id: string;
      clothingItem: TUpdateClothingItem;
      db: Database;
    }): Promise<TClothingItem[]> => {
      return db
        .update(clothingItems)
        .set(clothingItem)
        .where(eq(clothingItems.id, id))
        .returning();
    },
  ),
  /**
   * @description Delete a clothing item by their ID
   * @param id - The ID of the clothing item to delete
   * @returns The deleted clothing item
   */
  deleteClothingItem: supportsTransaction(
    async ({
      id,
      db,
    }: {
      id: string;
      db: Database;
    }): Promise<TClothingItem[]> => {
      return db
        .delete(clothingItems)
        .where(eq(clothingItems.id, id))
        .returning();
    },
  ),
};

export default ClothingItemService;
