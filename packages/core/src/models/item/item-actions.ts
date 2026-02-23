'use server';

import type {
  TCreateItem,
  TItem,
  TUpdateItem,
} from '@openhome-os/core/models/item/item-types';

import ItemService from './item-service';

export async function createItem({
  data,
}: {
  data: TCreateItem;
}): Promise<TItem | undefined> {
  try {
    const [item] = await ItemService.createItem({ item: data });
    return item;
  } catch (error) {
    console.error('[createItem]', error);
    throw new Error('Failed to create Item');
  }
}

export async function getItems(): Promise<TItem[]> {
  try {
    return await ItemService.getAllItems();
  } catch (error) {
    console.error('[getItems]', error);
    throw new Error('Failed to get Items');
  }
}

export async function getItem({ id }: { id: string }): Promise<TItem> {
  try {
    const item = await ItemService.getItem({ id });
    if (!item) throw new Error('Item not found');
    return item;
  } catch (error) {
    console.error('[getItem]', error);
    throw new Error('Failed to get Item');
  }
}

export async function updateItem({
  id,
  data,
}: {
  id: string;
  data: TUpdateItem;
}): Promise<TItem> {
  try {
    const [item] = await ItemService.updateItem({ id, item: data });
    if (!item) throw new Error('Item not found');
    return item;
  } catch (error) {
    console.error('[updateItem]', error);
    throw new Error('Failed to update Item');
  }
}

export async function deleteItem({ id }: { id: string }): Promise<TItem> {
  try {
    const [item] = await ItemService.deleteItem({ id });
    if (!item) throw new Error('Item not found');
    return item;
  } catch (error) {
    console.error('[deleteItem]', error);
    throw new Error('Failed to delete Item');
  }
}
