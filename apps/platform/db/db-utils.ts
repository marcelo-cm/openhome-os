import { type Database, db } from '@/db/db';

/**
 * @description Wrap a Service function with an optional transaction, forwarding the original props but replacing db with the transaction client if provided
 *
 * @example
 * const UserService = {
 *   createUser: supportsTransaction(async ({ user, db }) => {
 *     return db.insert(users).values(user).returning();
 *   }),
 *   getAllUser: supportsTransaction(async ({ db }) => {
 *     return db.query.users.findMany();
 *   }),
 * };
 *
 * If UserService.createUser is called with a transaction, the transaction will be used to execute the function, otherwise the default db client will be used.
 * Methods can be called without params if they only need db: getAllUser() or getAllUser({ tx })
 */
export const supportsTransaction = <TParams extends { db: Database }, TReturn>(
  fn: (params: TParams) => Promise<TReturn>,
) => {
  return async (
    params?: Omit<TParams, 'db'> & { tx?: Database },
  ): Promise<TReturn> => {
    const { tx, ...restParams } = params ?? {};
    return fn({ ...restParams, db: tx ?? db } as TParams);
  };
};
