import { text, timestamp } from 'drizzle-orm/pg-core';

export const DrizzleBaseModel = {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  created_at: timestamp('created_at', {
    mode: 'date',
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at', {
    mode: 'date',
    precision: 3,
    withTimezone: true,
  }),
};
export interface IBaseModel {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
// Backwards-compatible alias for existing imports
export type TBaseModel = IBaseModel;
export type TWithoutBaseModel<T> = Omit<T, keyof IBaseModel>;
