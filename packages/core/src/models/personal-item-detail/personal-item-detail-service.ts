import { Database } from '@openhome-os/core/db/db';
import { items, personalItemDetails } from '@openhome-os/core/db/db-schema';
import { ItemCategory } from '@openhome-os/core/models/item/item-enums';
import type { TCreateItem } from '@openhome-os/core/models/item/item-types';
import { eq } from 'drizzle-orm';

import { supportsTransaction } from '../../db/db-utils';
import type {
  TCreatePersonalItemDetail,
  TPersonalItemDetail,
} from './personal-item-detail-types';

const PersonalItemDetailService = {
  createPersonalItem: supportsTransaction(
    async ({
      item,
      details,
      db,
    }: {
      item: Omit<TCreateItem, 'category'>;
      details: Omit<TCreatePersonalItemDetail, 'item_id'>;
      db: Database;
    }) => {
      const [createdItem] = await db
        .insert(items)
        .values({ ...item, category: ItemCategory.PERSONAL })
        .returning();

      if (!createdItem) throw new Error('Failed to create base item');

      const [createdDetails] = await db
        .insert(personalItemDetails)
        .values({ ...details, item_id: createdItem.id })
        .returning();

      return { ...createdItem, personalItemDetails: createdDetails };
    },
  ),

  getPersonalItem: supportsTransaction(
    async ({ id, db }: { id: string; db: Database }) => {
      return db.query.items.findFirst({
        where: eq(items.id, id),
        with: { personalItemDetails: true },
      });
    },
  ),

  getAllPersonalItems: supportsTransaction(async ({ db }: { db: Database }) => {
    return db.query.items.findMany({
      where: eq(items.category, ItemCategory.PERSONAL),
      with: { personalItemDetails: true },
    });
  }),

  updatePersonalItemDetails: supportsTransaction(
    async ({
      itemId,
      details,
      db,
    }: {
      itemId: string;
      details: Partial<TPersonalItemDetail>;
      db: Database;
    }) => {
      return db
        .update(personalItemDetails)
        .set(details)
        .where(eq(personalItemDetails.item_id, itemId))
        .returning();
    },
  ),
};

export default PersonalItemDetailService;
