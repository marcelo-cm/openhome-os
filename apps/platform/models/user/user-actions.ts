'use server';

import { AuthError } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

import { db } from '@/db/db';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { uploadProfilePicture } from '@/lib/supabase/storage';
import OrganizationService from '@/models/organization/organization-service';
import ProjectService from '@/models/project/project-service';
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
    if (error instanceof Error && error.message.includes('prerendering')) {
      return null;
    }
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
    // First, get the user to verify it exists
    const user = await UserService.getUser({ id });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete the auth user from Supabase
    const supabaseAdmin = createAdminClient();
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      console.error('[deleteUser] Error deleting auth user:', authError);
      // Continue with database deletion even if auth deletion fails
      // This ensures we clean up the database record
    }

    // Delete the database user
    const [deletedUser] = await UserService.deleteUser({ id });

    if (!deletedUser) {
      throw new Error('Failed to delete user from database');
    }

    return deletedUser;
  } catch (error) {
    console.error('[deleteUser]', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
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

// Logout
export async function signOut(): Promise<{
  error: AuthError | null;
}> {
  try {
    const { error } = await UserService.logout();

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('[logout]', error);
    throw new Error('Failed to logout');
  }
  redirect('/sign-in');
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

/**
 * @description Sync OAuth user and create initial organization, project, and memberships in a single transaction
 * @param authUser - The Supabase auth user
 * @param profileData - Additional profile data from OAuth
 * @param organizationName - Optional organization name (defaults to email domain or "Personal Organization")
 * @param projectName - Optional project name (defaults to "Home")
 * @returns The synced user and created entities
 */
export async function syncOAuthUserWithSetup({
  authUser,
  profileData,
  organizationName,
  projectName = 'Home',
}: {
  authUser: { id: string; email: string };
  profileData?: {
    first_name?: string;
    last_name?: string;
    profile_picture_url?: string;
  };
  organizationName?: string;
  projectName?: string;
}): Promise<{
  user: TUser;
  organization: { id: string; name: string };
  project: { id: string; name: string };
}> {
  try {
    const orgName =
      organizationName || `${profileData?.first_name}'s Organization`;

    return await db.transaction(async (tx) => {
      // 1. Create organization
      const [organization] = await OrganizationService.createOrganization({
        organization: {
          name: orgName,
        },
        tx,
      });

      if (!organization) {
        throw new Error('Failed to create organization');
      }

      // 2. Sync/create user
      const user = await UserService.syncOAuthUser({
        authUser,
        profileData,
        organizationId: organization.id,
        tx,
      });

      if (!user) {
        throw new Error('Failed to sync/create user');
      }

      // 3. Add user as admin to organization
      await OrganizationService.addAdminToOrganization({
        principalId: user.id,
        organizationId: organization.id,
        userId: user.id,
        tx,
      });

      // 4. Create project under organization
      const [project] = await ProjectService.createProject({
        project: {
          name: projectName,
          organization_id: organization.id,
        },
        tx,
      });

      if (!project) {
        throw new Error('Failed to create project');
      }

      // 5. Add user as admin to project
      await ProjectService.addAdminToProject({
        projectId: project.id,
        principalId: user.id,
        userId: user.id,
        tx,
      });

      return {
        user,
        organization: {
          id: organization.id,
          name: organization.name,
        },
        project: {
          id: project.id,
          name: project.name,
        },
      };
    });
  } catch (error) {
    console.error('[syncOAuthUserWithSetup]', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Failed to sync OAuth user with setup');
  }
}
