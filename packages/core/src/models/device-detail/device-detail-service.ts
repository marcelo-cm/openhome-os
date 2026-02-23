import { Database } from '@openhome-os/core/db/db';
import { deviceDetails, items } from '@openhome-os/core/db/db-schema';
import { ItemCategory } from '@openhome-os/core/models/item/item-enums';
import type { TCreateItem } from '@openhome-os/core/models/item/item-types';
import { eq } from 'drizzle-orm';

import { supportsTransaction } from '../../db/db-utils';
import type { TCreateDeviceDetail, TDeviceDetail } from './device-detail-types';

const DeviceDetailService = {
  createDevice: supportsTransaction(
    async ({
      item,
      details,
      db,
    }: {
      item: Omit<TCreateItem, 'category'>;
      details: Omit<TCreateDeviceDetail, 'item_id'>;
      db: Database;
    }) => {
      const [createdItem] = await db
        .insert(items)
        .values({ ...item, category: ItemCategory.DEVICE })
        .returning();

      if (!createdItem) throw new Error('Failed to create base item');

      const [createdDetails] = await db
        .insert(deviceDetails)
        .values({ ...details, item_id: createdItem.id })
        .returning();

      return { ...createdItem, deviceDetails: createdDetails };
    },
  ),

  getDevice: supportsTransaction(
    async ({ id, db }: { id: string; db: Database }) => {
      return db.query.items.findFirst({
        where: eq(items.id, id),
        with: { deviceDetails: true },
      });
    },
  ),

  getAllDevices: supportsTransaction(async ({ db }: { db: Database }) => {
    return db.query.items.findMany({
      where: eq(items.category, ItemCategory.DEVICE),
      with: { deviceDetails: true },
    });
  }),

  updateDeviceDetails: supportsTransaction(
    async ({
      itemId,
      details,
      db,
    }: {
      itemId: string;
      details: Partial<TDeviceDetail>;
      db: Database;
    }) => {
      return db
        .update(deviceDetails)
        .set(details)
        .where(eq(deviceDetails.item_id, itemId))
        .returning();
    },
  ),
};

export default DeviceDetailService;
