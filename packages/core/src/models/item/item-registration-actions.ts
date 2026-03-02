'use server';

import { db } from '@openhome-os/core/db/db';
import type {
  TCreateItem,
  TItem,
} from '@openhome-os/core/models/item/item-types';
import type { TCreatePersonalItemDetail } from '@openhome-os/core/models/personal-item-detail/personal-item-detail-types';
import { getCurrentUser } from '@openhome-os/core/models/user/user-actions';
import StorageService from '@openhome-os/core/supabase/storage';

import ItemImageService from '../item-image/item-image-service';
import PersonalItemDetailService from '../personal-item-detail/personal-item-detail-service';

interface RegisterPersonalItemInput {
  item: Omit<TCreateItem, 'category' | 'principal_id'>;
  details: Omit<TCreatePersonalItemDetail, 'item_id'>;
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
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  try {
    const result = await db.transaction(async (tx) => {
      return PersonalItemDetailService.createPersonalItem({
        item: { ...data.item, principal_id: user.id },
        details: data.details,
        tx,
      });
    });

    const itemId = result.id;
    const imageFiles = (imageFormData?.getAll('images') as File[]) ?? [];

    if (imageFiles.length > 0) {
      const uploadResults = await Promise.all(
        imageFiles.map(async (file, index) => {
          const buffer = await file.arrayBuffer();
          return StorageService.uploadItemImage(
            buffer,
            itemId,
            file.name,
            index,
          );
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

    return result as TItem;
  } catch (error) {
    console.error('[registerPersonalItem]', error);
    throw new Error('Failed to register personal item');
  }
}
