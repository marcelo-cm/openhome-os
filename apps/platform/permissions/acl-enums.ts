/**
 * Resources that support fine-grained, per-instance ACL checks.
 * These are resource  whose access may vary for each individual record.
 *
 * @criteria Can this resource be "shared" with a user at the instance level
 *           (e.g. OWNER / EDITOR / VIEWER on a single record)?
 *           If yes, it belongs in AclResource.
 */
export enum AclResource {
  LOCATION = 'location',
}

/**
 * Access tiers granted to a user on a specific ACL resource instance.
 *
 * @criteria Do these roles describe what a user can do with a *specific instance*
 *           of a resource (e.g. "you are an OWNER of Post X")?
 *           If yes, it belongs in AclRole.
 *
 * - VIEWER → can only read the resource
 * - EDITOR → can read and modify the resource
 * - OWNER  → full control, including destructive actions
 */
export enum AclRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

/**
 * Actions that can be performed exclusively on an ACL resource.
 *
 * Examples:
 * - ADD_EDITOR → add an editor to the resource
 * - REMOVE_EDITOR → remove an editor from the resource
 * - ADD_OWNER → add an owner to the resource
 * - REMOVE_OWNER → remove an owner from the resource
 * - ADD_VIEWER → add a viewer to the resource
 * - REMOVE_VIEWER → remove a viewer from the resource
 */
export enum AclResourceAction {
  ADD_EDITOR = 'addEditor',
  REMOVE_EDITOR = 'removeEditor',
  ADD_VIEWER = 'addViewer',
  REMOVE_VIEWER = 'removeViewer',
}
