'use server';

import { createClient } from '@/lib/supabase/server';
import { uploadProfilePicture } from '@/lib/supabase/storage';
import { TCreateUser, TUpdateUser, TUser } from '@/models/user/user-types';

import UserService from './user-service';

// Create
export async function createUser({
  data,
}: {
  data: TCreateUser;
}): Promise<TUser | undefined> {
  try {
    const [user] = await UserService.createUser({ user: data });

    return user;
  } catch (error) {
    console.error('[createUser]', error);
    throw new Error('Failed to create User');
  }
}

// Read (Get)
export async function getUser({ id }: { id: string }): Promise<TUser> {
  try {
    const user = await UserService.getUser({ id });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('[getUser]', error);
    throw new Error('Failed to get User');
  }
}

// Get Current User
export async function getCurrentUser(): Promise<TUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    const user = await UserService.getUser({ id: authUser.id });

    return user ?? null;
  } catch (error) {
    console.error('[getCurrentUser]', error);
    throw new Error('Failed to get Current User');
  }
}

// Read (Get)
export async function getUsers(): Promise<TUser[]> {
  try {
    const users = await UserService.getAllUser();
    return users;
  } catch (error) {
    console.error('[getUsers]', error);
    throw new Error('Failed to get Users');
  }
}

// Update
export async function updateUser({
  id,
  data,
}: {
  id: string;
  data: TUpdateUser;
}): Promise<TUser> {
  try {
    const [user] = await UserService.updateUser({ id, user: data });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('[updateUser]', error);
    throw new Error('Failed to update User');
  }
}

// Delete
export async function deleteUser({ id }: { id: string }): Promise<TUser> {
  try {
    const [user] = await UserService.deleteUser({ id });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('[deleteUser]', error);
    throw new Error('Failed to delete User');
  }
}

// Actions
export async function signup({
  data,
  profilePicture,
}: {
  data: TCreateUser;
  profilePicture: File | null;
}): Promise<TUser> {
  try {
    const profilePictureUrl = profilePicture
      ? await uploadProfilePicture(
          await profilePicture.arrayBuffer(),
          data.email,
          profilePicture.name,
        )
      : null;

    const user = await UserService.signUp({
      user: { ...data, profile_picture_url: profilePictureUrl ?? undefined },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('[signup]', error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Failed to sign up User');
  }
}

export async function signin({
  data,
}: {
  data: {
    email: string;
    password: string;
  };
}): Promise<TUser> {
  try {
    const user = await UserService.signIn({
      email: data.email,
      password: data.password,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('[signin]', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Failed to sign in User');
  }
}

export async function signInWithOAuth({
  provider,
}: {
  provider: 'google';
}): Promise<{ url: string }> {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { url: data.url };
  } catch (error) {
    console.error('[signInWithOAuth]', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Failed to sign in with OAuth');
  }
}

// OAuth
export async function syncOAuthUser({
  authUser,
  profileData,
}: {
  authUser: { id: string; email: string };
  profileData?: {
    first_name?: string;
    last_name?: string;
    profile_picture_url?: string;
  };
}): Promise<TUser> {
  try {
    const user = await UserService.syncOAuthUser({ authUser, profileData });
    return user;
  } catch (error) {
    console.error('[syncOAuthUser]', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Failed to sync OAuth user');
  }
}
