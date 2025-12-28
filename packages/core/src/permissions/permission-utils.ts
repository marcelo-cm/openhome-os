import { AclResource, AclResourceAction, AclRole } from './acl-enums';
import { ACL_ROLE_PERMISSIONS_BY_RESOURCE } from './acl-roles';
import { TAclPermissionKey } from './acl-types';
import { ResourceAction } from './permission-enums';
import type { TPermissionKey } from './permission-types';
import { RbacResource, RbacResourceAction, RbacRole } from './rbac-enums';
import { RBAC_ROLE_PERMISSIONS_BY_RESOURCE } from './rbac-roles';
import { TRbacPermissionKey } from './rbac-types';

/**
 * Gets the permission keys that an RBAC role grants on a type of resource.
 * Returns empty array if role is null.
 *
 * @example getRbacRolePermissionsFor(RbacResource.POST, RbacRole.EDITOR) // => ['read:post', 'update:post']
 */
export function getRbacRolePermissionsFor(
  resource: RbacResource,
  role: RbacRole | null | undefined,
): readonly TPermissionKey<
  RbacResource | AclResource,
  ResourceAction | RbacResourceAction
>[] {
  return role ? RBAC_ROLE_PERMISSIONS_BY_RESOURCE[resource][role] : [];
}

/**
 * Gets the permission keys that an ACL role grants on a type of resource.
 * Returns empty array if role is null.
 *
 * @example getAclRolePermissionsFor(AclResource.LOCATION, AclRole.EDITOR) // => ['read:post', 'update:post']
 */
export function getAclRolePermissionsFor(
  resource: AclResource,
  role: AclRole | null | undefined,
): readonly TPermissionKey<AclResource, AclResourceAction | ResourceAction>[] {
  return role ? ACL_ROLE_PERMISSIONS_BY_RESOURCE[resource][role] : [];
}

/**
 * Checks if a user has a permission on a resource.
 *
 * @example can(PERMISSION[AclResource.LOCATION][ResourceAction.DELETE], { rbacRole: RbacRole.MEMBER, rbacResource: RbacResource.PROJECT, aclRole: AclRole.OWNER, aclResource: AclResource.LOCATION }) // => true (OR logic by default)
 * @example can(PERMISSION[AclResource.LOCATION][PostAction.PUBLISH_TO_PRODUCTION], { rbacRole: RbacRole.MEMBER, rbacResource: RbacResource.PROJECT, aclRole: AclRole.EDITOR, aclResource: AclResource.LOCATION, mode: 'all' }) // => true only if both
 */
export function can(
  permission: TRbacPermissionKey | TAclPermissionKey,
  opts: _CanOptions,
): boolean {
  // SUPER_ADMIN bypass: allow everything unconditionally
  if ('isSuperAdmin' in opts && opts.isSuperAdmin) {
    return true;
  }

  const hasRbac = 'rbacResource' in opts && 'rbacRole' in opts;
  const hasAcl = 'aclResource' in opts && 'aclRole' in opts;

  // Get permissions from each system if available
  const rbacPermissions = hasRbac
    ? getRbacRolePermissionsFor(opts.rbacResource, opts.rbacRole)
    : [];

  const aclPermissions = hasAcl
    ? getAclRolePermissionsFor(opts.aclResource, opts.aclRole)
    : [];

  const hasRbacPermission = rbacPermissions.includes(
    permission as TRbacPermissionKey,
  );
  const hasAclPermission = aclPermissions.includes(
    permission as TAclPermissionKey,
  );

  // If only one system is provided, check that system
  if (hasRbac && !hasAcl) {
    return hasRbacPermission;
  }
  if (hasAcl && !hasRbac) {
    return hasAclPermission;
  }

  // If both systems are provided, apply the mode logic
  const mode = 'mode' in opts ? opts.mode : 'any'; // Default to 'any' (OR logic)
  const result =
    mode === 'all'
      ? hasRbacPermission && hasAclPermission // Both required
      : hasRbacPermission || hasAclPermission; // Either is sufficient

  return result;
}

type _CanOptions =
  | {
      rbacResource: RbacResource;
      rbacRole: RbacRole | undefined;
      isSuperAdmin?: boolean;
    }
  | {
      aclResource: AclResource;
      aclRole: AclRole | undefined;
      isSuperAdmin?: boolean;
    }
  | {
      rbacResource: RbacResource;
      rbacRole: RbacRole | undefined;
      aclResource: AclResource;
      aclRole: AclRole | undefined;
      isSuperAdmin?: boolean;
      mode?: 'any' | 'all'; // Optional, defaults to 'any'
    };
