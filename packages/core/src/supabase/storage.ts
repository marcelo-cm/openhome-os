import { createAdminClient } from './admin';
import { STORAGE_BUCKETS } from './constants';

function getFileExtension(fileName: string): string {
  return fileName.split('.').pop() ?? 'bin';
}

function inferContentType(ext: string): string {
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    avif: 'image/avif',
  };
  return types[ext.toLowerCase()] ?? `image/${ext}`;
}

/**
 * Generic and domain-specific Supabase Storage operations.
 *
 * Generic methods (`uploadFile`, `deleteFile`, `deleteFiles`, `getPublicUrl`)
 * accept explicit bucket/path params. Domain methods are thin wrappers that
 * encode the bucket + path conventions for each feature.
 */
const StorageService = {
  // ---------------------------------------------------------------------------
  // Generic
  // ---------------------------------------------------------------------------

  async uploadFile(
    bucket: string,
    path: string,
    file: ArrayBuffer,
    contentType: string,
  ): Promise<{ url: string; storagePath: string }> {
    const supabase = createAdminClient();

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType,
    });

    if (error) {
      throw new Error(
        `Storage upload failed (${bucket}/${path}): ${error.message}`,
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return { url: publicUrl, storagePath: path };
  },

  async deleteFile(bucket: string, path: string): Promise<void> {
    const supabase = createAdminClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new Error(
        `Storage delete failed (${bucket}/${path}): ${error.message}`,
      );
    }
  },

  async deleteFiles(bucket: string, paths: string[]): Promise<void> {
    if (paths.length === 0) return;

    const supabase = createAdminClient();

    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      throw new Error(
        `Storage batch delete failed (${bucket}): ${error.message}`,
      );
    }
  },

  getPublicUrl(bucket: string, path: string): string {
    const supabase = createAdminClient();
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl;
  },

  // ---------------------------------------------------------------------------
  // Domain: Profile Pictures
  // ---------------------------------------------------------------------------

  /**
   * @returns The public URL of the uploaded profile picture.
   */
  async uploadProfilePicture(
    fileBuffer: ArrayBuffer,
    userId: string,
    fileName: string,
  ): Promise<string> {
    const ext = getFileExtension(fileName);
    const path = `${userId}-${Date.now()}.${ext}`;

    const { url } = await StorageService.uploadFile(
      STORAGE_BUCKETS.PROFILE_PICTURES,
      path,
      fileBuffer,
      inferContentType(ext),
    );

    return url;
  },

  async deleteProfilePicture(fileUrl: string): Promise<void> {
    const path = fileUrl.split('/').pop();
    if (!path) throw new Error('Invalid profile picture URL');

    await StorageService.deleteFile(STORAGE_BUCKETS.PROFILE_PICTURES, path);
  },

  // ---------------------------------------------------------------------------
  // Domain: Item Images
  // ---------------------------------------------------------------------------

  /**
   * Uploads an item image to `{itemId}/{order}-{timestamp}.{ext}`.
   *
   * @returns Both the public URL and the internal storage path (for later deletion).
   */
  async uploadItemImage(
    fileBuffer: ArrayBuffer,
    itemId: string,
    fileName: string,
    order: number,
  ): Promise<{ url: string; storagePath: string }> {
    const ext = getFileExtension(fileName);
    const path = `${itemId}/${order}-${Date.now()}.${ext}`;

    return StorageService.uploadFile(
      STORAGE_BUCKETS.ITEM_IMAGES,
      path,
      fileBuffer,
      inferContentType(ext),
    );
  },

  async deleteItemImage(storagePath: string): Promise<void> {
    await StorageService.deleteFile(STORAGE_BUCKETS.ITEM_IMAGES, storagePath);
  },

  async deleteItemImages(storagePaths: string[]): Promise<void> {
    await StorageService.deleteFiles(STORAGE_BUCKETS.ITEM_IMAGES, storagePaths);
  },
};

export default StorageService;

/**
 * Re-export for backward compatibility with existing consumer in user-actions.ts.
 */
export const uploadProfilePicture = StorageService.uploadProfilePicture;
