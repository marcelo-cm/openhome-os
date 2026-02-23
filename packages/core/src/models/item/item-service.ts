import { Database } from '@openhome-os/core/db/db';
import { items } from '@openhome-os/core/db/db-schema';
import type {
  TCreateItem,
  TItem,
  TUpdateItem,
} from '@openhome-os/core/models/item/item-types';
import { eq } from 'drizzle-orm';

import { supportsTransaction } from '../../db/db-utils';

/**
 * Base CRUD operations on the items table.
 * Category-specific services extend this by joining to their detail tables.
 */
const ItemService = {
  createItem: supportsTransaction(
    async ({
      item,
      db,
    }: {
      item: TCreateItem;
      db: Database;
    }): Promise<TItem[]> => {
      return db.insert(items).values(item).returning();
    },
  ),

  getItem: supportsTransaction(
    async ({
      id,
      db,
    }: {
      id: string;
      db: Database;
    }): Promise<TItem | undefined> => {
      return db.query.items.findFirst({
        where: eq(items.id, id),
      });
    },
  ),

  getAllItems: supportsTransaction(
    async ({ db }: { db: Database }): Promise<TItem[]> => {
      return db.query.items.findMany();
    },
  ),

  getItemsByCategory: supportsTransaction(
    async ({
      category,
      db,
    }: {
      category: string;
      db: Database;
    }): Promise<TItem[]> => {
      return db.query.items.findMany({
        where: eq(items.category, category),
      });
    },
  ),

  getItemsByPrincipal: supportsTransaction(
    async ({
      principalId,
      db,
    }: {
      principalId: string;
      db: Database;
    }): Promise<TItem[]> => {
      return db.query.items.findMany({
        where: eq(items.principal_id, principalId),
      });
    },
  ),

  updateItem: supportsTransaction(
    async ({
      id,
      item,
      db,
    }: {
      id: string;
      item: TUpdateItem;
      db: Database;
    }): Promise<TItem[]> => {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { id: _omit, ...toSet } = item;
      return db.update(items).set(toSet).where(eq(items.id, id)).returning();
    },
  ),

  deleteItem: supportsTransaction(
    async ({ id, db }: { id: string; db: Database }): Promise<TItem[]> => {
      return db.delete(items).where(eq(items.id, id)).returning();
    },
  ),
};

export default ItemService;
