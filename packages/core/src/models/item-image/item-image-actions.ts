'use server';

import type {
  TCreateItemImage,
  TItemImage,
} from '@openhome-os/core/models/item-image/item-image-types';

import ItemImageService from './item-image-service';

export async function createItemImage({
  data,
}: {
  data: TCreateItemImage;
}): Promise<TItemImage | undefined> {
  try {
    const [image] = await ItemImageService.createItemImage({ itemImage: data });
    return image;
  } catch (error) {
    console.error('[createItemImage]', error);
    throw new Error('Failed to create item image');
  }
}

export async function createItemImages({
  data,
}: {
  data: TCreateItemImage[];
}): Promise<TItemImage[]> {
  try {
    return await ItemImageService.createItemImages({ images: data });
  } catch (error) {
    console.error('[createItemImages]', error);
    throw new Error('Failed to create item images');
  }
}

export async function getItemImages({
  itemId,
}: {
  itemId: string;
}): Promise<TItemImage[]> {
  try {
    return await ItemImageService.getImagesByItemId({ itemId });
  } catch (error) {
    console.error('[getItemImages]', error);
    throw new Error('Failed to get item images');
  }
}

export async function deleteItemImage({
  id,
}: {
  id: string;
}): Promise<TItemImage | undefined> {
  try {
    const [image] = await ItemImageService.deleteItemImage({ id });
    return image;
  } catch (error) {
    console.error('[deleteItemImage]', error);
    throw new Error('Failed to delete item image');
  }
}

export async function deleteItemImagesByItemId({
  itemId,
}: {
  itemId: string;
}): Promise<TItemImage[]> {
  try {
    return await ItemImageService.deleteImagesByItemId({ itemId });
  } catch (error) {
    console.error('[deleteItemImagesByItemId]', error);
    throw new Error('Failed to delete item images');
  }
}
