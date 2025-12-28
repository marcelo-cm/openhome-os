import { createAdminClient } from './admin';
import { DATABASE_CONSTANTS } from './constants';

const PROFILE_PICTURES_BUCKET = process.env.SUPABASE_BUCKET!;

/**
 * Uploads a profile picture from the server side
 * @param file - The file buffer
 * @param userId - The user ID to use for the filename
 * @param fileName - Original filename
 * @returns The public URL of the uploaded file
 */
export async function uploadProfilePicture(
  fileBuffer: ArrayBuffer,
  userId: string,
  fileName: string,
): Promise<string> {
  const supabase = await createAdminClient();

  // Generate unique filename with timestamp
  const fileExt = fileName.split('.').pop();
  const uniqueFileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${DATABASE_CONSTANTS.PROFILE_PICTURES_FOLDER}/${uniqueFileName}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(PROFILE_PICTURES_BUCKET)
    .upload(filePath, fileBuffer, {
      cacheControl: '3600',
      upsert: true,
      contentType: `image/${fileExt}`,
    });

  if (uploadError) {
    throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(PROFILE_PICTURES_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Deletes a profile picture from Supabase Storage
 * @param fileUrl - The public URL of the file to delete
 */
export async function deleteProfilePicture(fileUrl: string): Promise<void> {
  const supabase = await createAdminClient();

  // Extract filename from URL
  const fileName = fileUrl
    .split(`${DATABASE_CONSTANTS.PROFILE_PICTURES_FOLDER}/`)
    .pop();
  if (!fileName) {
    throw new Error('Invalid file URL');
  }

  const { error } = await supabase.storage
    .from(PROFILE_PICTURES_BUCKET)
    .remove([fileName]);

  if (error) {
    throw new Error(`Failed to delete profile picture: ${error.message}`);
  }
}
