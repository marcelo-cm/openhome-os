import { Database } from '@openhome-os/core/db/db';
import { homeItemDetails, items } from '@openhome-os/core/db/db-schema';
import { ItemCategory } from '@openhome-os/core/models/item/item-enums';
import type { TCreateItem } from '@openhome-os/core/models/item/item-types';
import { eq } from 'drizzle-orm';

import { supportsTransaction } from '../../db/db-utils';
import type {
  TCreateHomeItemDetail,
  THomeItemDetail,
} from './home-item-detail-types';

const HomeItemDetailService = {
  createHomeItem: supportsTransaction(
    async ({
      item,
      details,
      db,
    }: {
      item: Omit<TCreateItem, 'category'>;
      details: Omit<TCreateHomeItemDetail, 'item_id'>;
      db: Database;
    }) => {
      const [createdItem] = await db
        .insert(items)
        .values({ ...item, category: ItemCategory.HOME })
        .returning();

      if (!createdItem) throw new Error('Failed to create base item');

      const [createdDetails] = await db
        .insert(homeItemDetails)
        .values({ ...details, item_id: createdItem.id })
        .returning();

      return { ...createdItem, homeItemDetails: createdDetails };
    },
  ),

  getHomeItem: supportsTransaction(
    async ({ id, db }: { id: string; db: Database }) => {
      return db.query.items.findFirst({
        where: eq(items.id, id),
        with: { homeItemDetails: true },
      });
    },
  ),

  getAllHomeItems: supportsTransaction(async ({ db }: { db: Database }) => {
    return db.query.items.findMany({
      where: eq(items.category, ItemCategory.HOME),
      with: { homeItemDetails: true },
    });
  }),

  updateHomeItemDetails: supportsTransaction(
    async ({
      itemId,
      details,
      db,
    }: {
      itemId: string;
      details: Partial<THomeItemDetail>;
      db: Database;
    }) => {
      return db
        .update(homeItemDetails)
        .set(details)
        .where(eq(homeItemDetails.item_id, itemId))
        .returning();
    },
  ),
};

export default HomeItemDetailService;
