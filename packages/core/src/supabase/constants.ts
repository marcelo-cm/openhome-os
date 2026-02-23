export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const STORAGE_BUCKETS = {
  PROFILE_PICTURES: 'profile-pictures',
  ITEM_IMAGES: 'item-images',
} as const;
