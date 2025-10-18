/**
 * All resource types recognized by the RBAC system.
 *
 * @criteria Can access to this resource be controlled by assigning a role
 *           scoped to the whole org/project/global level (not per instance)?
 *           If yes, it belongs in RbacResource.
 *
 * These are the nouns that pair with actions to form permission keys,
 * e.g. 'update:post' or 'read:org'.
 */
export enum RbacResource {
  ORG = 'organization',
  PROJECT = 'project',
}

/**
 * Application-wide roles that define bundles of permissions within
 * a given scope.
 *
 * @criteria Do these roles describe what a user can do across an *entire scope*
 *           (global / organization / project), regardless of individual items?
 *           If yes, it belongs in RbacRole.
 *
 * - SUPER_ADMIN → globally scoped, unrestricted access
 * - ADMIN       → high-level control at the org or project level
 * - MEMBER      → standard role with limited access
 *
 * Roles combine with scope (org/project/global) to produce grants.
 */
export enum RbacRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

/**
 * Contextual requirements that must be satisfied for a user to
 * exercise a permission on a specific resource instance.
 *
 * Examples:
 * - IS_SUPER_ADMIN → user holds the global SUPER_ADMIN role
 * - IS_OWNER       → user is the owner of the resource instance
 * - IN_ORG         → user belongs to the target organization
 * - IN_PROJECT     → user belongs to the target project
 * - FEATURE_FLAG   → a feature flag is enabled
 * - PLAN_TIER      → the org is on or above a required plan
 * - ACL_AT_LEAST   → user’s ACL role meets a minimum threshold
 * - ROLE_AT_LEAST  → user’s RBAC role meets a minimum threshold
 *
 * Conditions form Phase 2 of evaluation: deciding whether a
 * permission key actually applies in context.
 */
export enum RbacCondition {
  IS_SUPER_ADMIN = 'isSuperAdmin',
  IS_OWNER = 'isOwner',
  IN_ORG = 'inOrg',
  IN_PROJECT = 'inProject',
  FEATURE_FLAG = 'featureFlag',
  PLAN_TIER = 'planTier',
  ACL_AT_LEAST = 'aclAtLeast',
  ROLE_AT_LEAST = 'roleAtLeast',
}

/**
 * Actions that can be performed exclusively on a RBAC resource.
 *
 * Examples:
 * - ADD_MEMBERSHIP → add a membership to the resource
 * - REMOVE_MEMBERSHIP → remove a membership from the resource
 * - ADD_ADMIN → add an admin to the resource
 * - REMOVE_ADMIN → remove an admin from the resource
 *
 */
export enum RbacResourceAction {
  ADD_MEMBERSHIP = 'addMembership',
  REMOVE_MEMBERSHIP = 'removeMembership',
  ADD_ADMIN = 'addAdmin',
  REMOVE_ADMIN = 'removeAdmin',
}
