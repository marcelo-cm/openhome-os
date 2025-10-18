/**
 * Canonical verbs that represent operations a user can perform
 * on any resource in the system.
 *
 * Examples:
 * - READ → fetch a single resource
 * - LIST → fetch multiple resources
 * - CREATE → add a new resource
 * - UPDATE → modify an existing resource
 * - DELETE → remove an existing resource
 */
export enum ResourceAction {
  READ = 'read',
  LIST = 'list',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}
