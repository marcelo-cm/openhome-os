import { Database } from '@openhome-os/core/db/db';
import { furnitureDetails, items } from '@openhome-os/core/db/db-schema';
import { ItemCategory } from '@openhome-os/core/models/item/item-enums';
import type { TCreateItem } from '@openhome-os/core/models/item/item-types';
import { eq } from 'drizzle-orm';

import { supportsTransaction } from '../../db/db-utils';
import type {
  TCreateFurnitureDetail,
  TFurnitureDetail,
} from './furniture-detail-types';

const FurnitureDetailService = {
  createFurniture: supportsTransaction(
    async ({
      item,
      details,
      db,
    }: {
      item: Omit<TCreateItem, 'category'>;
      details: Omit<TCreateFurnitureDetail, 'item_id'>;
      db: Database;
    }) => {
      const [createdItem] = await db
        .insert(items)
        .values({ ...item, category: ItemCategory.FURNITURE })
        .returning();

      if (!createdItem) throw new Error('Failed to create base item');

      const [createdDetails] = await db
        .insert(furnitureDetails)
        .values({ ...details, item_id: createdItem.id })
        .returning();

      return { ...createdItem, furnitureDetails: createdDetails };
    },
  ),

  getFurniture: supportsTransaction(
    async ({ id, db }: { id: string; db: Database }) => {
      return db.query.items.findFirst({
        where: eq(items.id, id),
        with: { furnitureDetails: true },
      });
    },
  ),

  getAllFurniture: supportsTransaction(async ({ db }: { db: Database }) => {
    return db.query.items.findMany({
      where: eq(items.category, ItemCategory.FURNITURE),
      with: { furnitureDetails: true },
    });
  }),

  updateFurnitureDetails: supportsTransaction(
    async ({
      itemId,
      details,
      db,
    }: {
      itemId: string;
      details: Partial<TFurnitureDetail>;
      db: Database;
    }) => {
      return db
        .update(furnitureDetails)
        .set(details)
        .where(eq(furnitureDetails.item_id, itemId))
        .returning();
    },
  ),
};

export default FurnitureDetailService;
