import type { Database } from '@openhome-os/core/db/db';
import { clothingDetails, items } from '@openhome-os/core/db/db-schema';
import { ItemCategory } from '@openhome-os/core/models/item/item-enums';
import type { TCreateItem } from '@openhome-os/core/models/item/item-types';
import { eq } from 'drizzle-orm';

import { supportsTransaction } from '../../db/db-utils';
import type {
  TClothingDetail,
  TCreateClothingDetail,
} from './clothing-detail-types';

/**
 * Service for clothing items — operates on both the base items table
 * and the clothing_details extension table in a single transaction.
 */
const ClothingDetailService = {
  /**
   * Create a clothing item (inserts into both items and clothing_details).
   */
  createClothingItem: supportsTransaction(
    async ({
      item,
      details,
      db,
    }: {
      item: Omit<TCreateItem, 'category'>;
      details: Omit<TCreateClothingDetail, 'item_id'>;
      db: Database;
    }) => {
      const [createdItem] = await db
        .insert(items)
        .values({ ...item, category: ItemCategory.CLOTHING })
        .returning();

      if (!createdItem) throw new Error('Failed to create base item');

      const [createdDetails] = await db
        .insert(clothingDetails)
        .values({ ...details, item_id: createdItem.id })
        .returning();

      return { ...createdItem, clothingDetails: createdDetails };
    },
  ),

  /**
   * Get a clothing item by ID (joined).
   */
  getClothingItem: supportsTransaction(
    async ({ id, db }: { id: string; db: Database }) => {
      return db.query.items.findFirst({
        where: eq(items.id, id),
        with: { clothingDetails: true },
      });
    },
  ),

  /**
   * Get all clothing items (joined).
   */
  getAllClothingItems: supportsTransaction(async ({ db }: { db: Database }) => {
    return db.query.items.findMany({
      where: eq(items.category, ItemCategory.CLOTHING),
      with: { clothingDetails: true },
    });
  }),

  /**
   * Update clothing details only.
   */
  updateClothingDetails: supportsTransaction(
    async ({
      itemId,
      details,
      db,
    }: {
      itemId: string;
      details: Partial<TClothingDetail>;
      db: Database;
    }) => {
      return db
        .update(clothingDetails)
        .set(details)
        .where(eq(clothingDetails.item_id, itemId))
        .returning();
    },
  ),
};

export default ClothingDetailService;
