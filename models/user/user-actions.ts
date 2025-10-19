'use server';

import { TCreateUser, TUpdateUser, TUser } from '@/models/user/user-types';

import UserService from './user-service';

// Create
export async function createUser({
  data,
}: {
  data: TCreateUser;
}): Promise<TUser> {
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

// Read (Get)
export async function getUsers(): Promise<TUser[]> {
  try {
    const users = await UserService.getAllUser();

    console.log('[getUsers]', users);
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
export async function signup({ data }: { data: TCreateUser }): Promise<TUser> {
  try {
    const user = await UserService.signUp({ user: data });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('[signup]', error);
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
    throw new Error('Failed to sign in User');
  }
}
