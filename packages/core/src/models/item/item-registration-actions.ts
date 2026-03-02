'use server';

import { db } from '@openhome-os/core/db/db';
import type {
  TCreateItem,
  TItem,
} from '@openhome-os/core/models/item/item-types';
import type { TCreateClothingDetail } from '@openhome-os/core/models/clothing-detail/clothing-detail-types';
import type { TCreateDeviceDetail } from '@openhome-os/core/models/device-detail/device-detail-types';
import type { TCreateFurnitureDetail } from '@openhome-os/core/models/furniture-detail/furniture-detail-types';
import type { TCreateHomeItemDetail } from '@openhome-os/core/models/home-item-detail/home-item-detail-types';
import type { TCreatePersonalItemDetail } from '@openhome-os/core/models/personal-item-detail/personal-item-detail-types';
import { getCurrentUser } from '@openhome-os/core/models/user/user-actions';
import StorageService from '@openhome-os/core/supabase/storage';

import ClothingDetailService from '../clothing-detail/clothing-detail-service';
import DeviceDetailService from '../device-detail/device-detail-service';
import FurnitureDetailService from '../furniture-detail/furniture-detail-service';
import HomeItemDetailService from '../home-item-detail/home-item-detail-service';
import ItemImageService from '../item-image/item-image-service';
import PersonalItemDetailService from '../personal-item-detail/personal-item-detail-service';

interface RegisterPersonalItemInput {
  item: Omit<TCreateItem, 'category' | 'principal_id'>;
  details: Omit<TCreatePersonalItemDetail, 'item_id'>;
}

interface RegisterClothingItemInput {
  item: Omit<TCreateItem, 'category' | 'principal_id'>;
  details: Omit<TCreateClothingDetail, 'item_id'>;
}

interface RegisterDeviceItemInput {
  item: Omit<TCreateItem, 'category' | 'principal_id'>;
  details: Omit<TCreateDeviceDetail, 'item_id'>;
}

interface RegisterHomeItemInput {
  item: Omit<TCreateItem, 'category' | 'principal_id'>;
  details: Omit<TCreateHomeItemDetail, 'item_id'>;
}

interface RegisterFurnitureItemInput {
  item: Omit<TCreateItem, 'category' | 'principal_id'>;
  details: Omit<TCreateFurnitureDetail, 'item_id'>;
}

async function attachImagesToItem({
  itemId,
  imageFormData,
}: {
  itemId: string;
  imageFormData?: FormData;
}): Promise<void> {
  const imageFiles = (imageFormData?.getAll('images') as File[]) ?? [];
  if (imageFiles.length === 0) return;

  const uploadResults = await Promise.all(
    imageFiles.map(async (file, index) => {
      const buffer = await file.arrayBuffer();
      return StorageService.uploadItemImage(buffer, itemId, file.name, index);
    }),
  );

  await ItemImageService.createItemImages({
    images: uploadResults.map(({ url, storagePath }, index) => ({
      item_id: itemId,
      url,
      storage_path: storagePath,
      display_order: index,
    })),
  });
}

interface RegisterItemWithImagesOptions<TRegisteredItem extends { id: string }> {
  actionName: string;
  errorMessage: string;
  imageFormData?: FormData;
  createItem: (principalId: string) => Promise<TRegisteredItem>;
}

async function registerItemWithImages<TRegisteredItem extends { id: string }>({
  actionName,
  errorMessage,
  imageFormData,
  createItem,
}: RegisterItemWithImagesOptions<TRegisteredItem>): Promise<TItem> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  try {
    const result = await createItem(user.id);
    await attachImagesToItem({ itemId: result.id, imageFormData });
    return result as TItem;
  } catch (error) {
    console.error(`[${actionName}]`, error);
    throw new Error(errorMessage);
  }
}

/**
 * Registers a new personal item with optional images.
 *
 * @param data - Structured item + detail fields (no category/principal -- set server-side).
 * @param imageFormData - Optional FormData containing image File entries under "images".
 */
export async function registerPersonalItem(
  data: RegisterPersonalItemInput,
  imageFormData?: FormData,
): Promise<TItem> {
  return registerItemWithImages({
    actionName: 'registerPersonalItem',
    errorMessage: 'Failed to register personal item',
    imageFormData,
    createItem: async (principalId) => {
      return db.transaction(async (tx) => {
        return PersonalItemDetailService.createPersonalItem({
          item: { ...data.item, principal_id: principalId },
          details: data.details,
          tx,
        });
      });
    },
  });
}

export async function registerClothingItem(
  data: RegisterClothingItemInput,
  imageFormData?: FormData,
): Promise<TItem> {
  return registerItemWithImages({
    actionName: 'registerClothingItem',
    errorMessage: 'Failed to register clothing item',
    imageFormData,
    createItem: async (principalId) => {
      return db.transaction(async (tx) => {
        return ClothingDetailService.createClothingItem({
          item: { ...data.item, principal_id: principalId },
          details: data.details,
          tx,
        });
      });
    },
  });
}

export async function registerDeviceItem(
  data: RegisterDeviceItemInput,
  imageFormData?: FormData,
): Promise<TItem> {
  return registerItemWithImages({
    actionName: 'registerDeviceItem',
    errorMessage: 'Failed to register device item',
    imageFormData,
    createItem: async (principalId) => {
      return db.transaction(async (tx) => {
        return DeviceDetailService.createDevice({
          item: { ...data.item, principal_id: principalId },
          details: data.details,
          tx,
        });
      });
    },
  });
}

export async function registerHomeItem(
  data: RegisterHomeItemInput,
  imageFormData?: FormData,
): Promise<TItem> {
  return registerItemWithImages({
    actionName: 'registerHomeItem',
    errorMessage: 'Failed to register home item',
    imageFormData,
    createItem: async (principalId) => {
      return db.transaction(async (tx) => {
        return HomeItemDetailService.createHomeItem({
          item: { ...data.item, principal_id: principalId },
          details: data.details,
          tx,
        });
      });
    },
  });
}

export async function registerFurnitureItem(
  data: RegisterFurnitureItemInput,
  imageFormData?: FormData,
): Promise<TItem> {
  return registerItemWithImages({
    actionName: 'registerFurnitureItem',
    errorMessage: 'Failed to register furniture item',
    imageFormData,
    createItem: async (principalId) => {
      return db.transaction(async (tx) => {
        return FurnitureDetailService.createFurniture({
          item: { ...data.item, principal_id: principalId },
          details: data.details,
          tx,
        });
      });
    },
  });
}
