import { z } from 'zod';

import {
  CreateUserSchema,
  UpdateUserSchema,
  UserSchema,
} from '@/models/user/user-schemas';

export type TUser = z.infer<typeof UserSchema>;
export type TCreateUser = z.infer<typeof CreateUserSchema>;
export type TUpdateUser = z.infer<typeof UpdateUserSchema>;
