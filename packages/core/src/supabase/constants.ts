const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_PROJECT_ID = 'rikaurvfbouspdkmoims';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1/upload/resumable`;

export {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  SUPABASE_PROJECT_ID,
  SUPABASE_STORAGE_URL,
};

export const DATABASE_CONSTANTS = {
  PROFILE_PICTURES_FOLDER: 'profile-pictures',
};
