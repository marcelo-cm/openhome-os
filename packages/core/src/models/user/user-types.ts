import {
  CreateUserSchema,
  UpdateUserSchema,
  UserSchema,
} from '@openhome-os/core/models/user/user-schemas';
import { z } from 'zod';

export type TUser = z.infer<typeof UserSchema>;
export type TCreateUser = z.infer<typeof CreateUserSchema>;
export type TUpdateUser = z.infer<typeof UpdateUserSchema>;
