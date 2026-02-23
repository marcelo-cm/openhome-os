import type { Database } from '@openhome-os/core/db/db';
import { itemImages } from '@openhome-os/core/db/db-schema';
import type {
  TCreateItemImage,
  TItemImage,
} from '@openhome-os/core/models/item-image/item-image-types';
import { eq } from 'drizzle-orm';

import { supportsTransaction } from '../../db/db-utils';

const ItemImageService = {
  createItemImage: supportsTransaction(
    async ({
      itemImage,
      db,
    }: {
      itemImage: TCreateItemImage;
      db: Database;
    }): Promise<TItemImage[]> => {
      return db.insert(itemImages).values(itemImage).returning();
    },
  ),

  createItemImages: supportsTransaction(
    async ({
      images,
      db,
    }: {
      images: TCreateItemImage[];
      db: Database;
    }): Promise<TItemImage[]> => {
      if (images.length === 0) return [];
      return db.insert(itemImages).values(images).returning();
    },
  ),

  getImagesByItemId: supportsTransaction(
    async ({
      itemId,
      db,
    }: {
      itemId: string;
      db: Database;
    }): Promise<TItemImage[]> => {
      return db.query.itemImages.findMany({
        where: eq(itemImages.item_id, itemId),
        orderBy: itemImages.display_order,
      });
    },
  ),

  deleteItemImage: supportsTransaction(
    async ({ id, db }: { id: string; db: Database }): Promise<TItemImage[]> => {
      return db.delete(itemImages).where(eq(itemImages.id, id)).returning();
    },
  ),

  deleteImagesByItemId: supportsTransaction(
    async ({
      itemId,
      db,
    }: {
      itemId: string;
      db: Database;
    }): Promise<TItemImage[]> => {
      return db
        .delete(itemImages)
        .where(eq(itemImages.item_id, itemId))
        .returning();
    },
  ),
};

export default ItemImageService;
