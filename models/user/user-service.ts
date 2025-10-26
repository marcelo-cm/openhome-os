import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { users } from '@/db/db-schema';
import { TCreateUser, TUpdateUser, TUser } from '@/models/user/user-types';

/**
 * Interactions with the database for User
 */
const UserService = {
  /**
   * @description Create a user
   * @param user - The user to create
   * @returns The created user
   */
  createUser: async ({ user }: { user: TCreateUser }): Promise<TUser[]> => {
    return db.insert(users).values(user).returning();
  },
  /**
   * @description Get a user by their ID
   * @param id - The ID of the user to get
   * @returns The user with the given ID
   */
  getUser: async ({ id }: { id: string }): Promise<TUser | undefined> => {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  },
  /**
   * @description Get all users
   * @returns All users
   */
  getAllUser: async (): Promise<TUser[]> => {
    return db.query.users.findMany();
  },
  /**
   * @description Update a user by their ID
   * @param id - The ID of the user to update
   * @param user - The user to update
   * @returns The updated user
   */
  updateUser: async ({
    id,
    user,
  }: {
    id: string;
    user: TUpdateUser;
  }): Promise<TUser[]> => {
    return db.update(users).set(user).where(eq(users.id, id)).returning();
  },
  /**
   * @description Delete a user by their ID
   * @param id - The ID of the user to delete
   * @returns The deleted user
   */
  deleteUser: async ({ id }: { id: string }): Promise<TUser[]> => {
    return db.delete(users).where(eq(users.id, id)).returning();
  },
  /**
   * @description Sign in a user
   * @param email - The email of the user to sign in
   * @param password - The password of the user to sign in
   * @returns The signed in user
   */
  signIn: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<TUser | undefined> => {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[signIn] Supabase auth error:', error);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('No user returned from sign in');
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user;
  },
  /**
   * @description Sign up a user
   * @param user - The user to sign up
   * @returns The signed up user
   */
  signUp: async ({
    user,
  }: {
    user: TCreateUser;
  }): Promise<TUser | undefined> => {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    // Create auth user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (error) {
      console.error('[signUp] Supabase auth error:', error);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('No user returned from sign up');
    }

    // Create user record in database using the Supabase auth user ID
    const [dbUser] = await db
      .insert(users)
      .values({
        id: data.user.id, // Use Supabase auth user ID
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture_url: user.profile_picture_url,
        role: user.role,
        organization_id: user.organization_id,
      })
      .returning();

    return dbUser;
  },
  /**
   * @description Sync OAuth user with database
   * @param authUser - The Supabase auth user
   * @param profileData - Additional profile data from OAuth
   * @returns The synced user
   */
  syncOAuthUser: async ({
    authUser,
    profileData,
  }: {
    authUser: { id: string; email: string };
    profileData?: {
      first_name?: string;
      last_name?: string;
      profile_picture_url?: string;
    };
  }): Promise<TUser> => {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user from OAuth data
    const [newUser] = await db
      .insert(users)
      .values({
        id: authUser.id,
        email: authUser.email,
        first_name: profileData?.first_name || '',
        last_name: profileData?.last_name || null,
        profile_picture_url: profileData?.profile_picture_url || null,
      })
      .returning();

    return newUser;
  },
};

export default UserService;
