import { AclResource, AclResourceAction, AclRole } from './acl-enums';
import {
  TAclPermissionKey,
  TAclPermissionKeyByResource,
  TAllowedAclLevelActions,
} from './acl-types';
import { ResourceAction } from './permission-enums';
import { PERMISSION } from './permission-keys';

/**
 * Defines which actions each ACL role can perform on each resource.
 *
 * CREATE is excluded because you can't "create" an existing resource instance
 * you're being shared into.
 *
 * LIST is excluded because you can't "list" the resource instance
 * you're being shared into.
 *
 * @example LEVELS[AclResource.LOCATION][AclRole.EDITOR] // => [ResourceAction.READ, ResourceAction.UPDATE]
 */
export const ACL_LEVELS = {
  [AclResource.LOCATION]: {
    [AclRole.VIEWER]: [ResourceAction.READ],
    [AclRole.EDITOR]: [
      ResourceAction.READ,
      ResourceAction.UPDATE,
      AclResourceAction.ADD_EDITOR,
      AclResourceAction.REMOVE_EDITOR,
      AclResourceAction.ADD_VIEWER,
      AclResourceAction.REMOVE_VIEWER,
    ],
    [AclRole.OWNER]: [
      ResourceAction.READ,
      ResourceAction.UPDATE,
      ResourceAction.DELETE,
      AclResourceAction.ADD_EDITOR,
      AclResourceAction.REMOVE_EDITOR,
      AclResourceAction.ADD_VIEWER,
      AclResourceAction.REMOVE_VIEWER,
    ],
  },
} as const satisfies {
  [R in AclResource]: Readonly<
    Record<AclRole, readonly TAllowedAclLevelActions<R>[]>
  >;
};

/**
 * Maps each ACL role to its permission keys for each resource.
 *
 * Derived from LEVELS. Use this to get the actual permission keys
 * that an ACL role grants on a specific resource instance.
 *
 * @example ACL_PERMISSIONS_BY_RESOURCE[AclResource.LOCATION][AclRole.EDITOR] // => ['read:post', 'update:post']
 */
export const ACL_ROLE_PERMISSIONS_BY_RESOURCE: TAclPermissionKeyByResource =
  _buildAclRolePermissions();

// -----------------------------------------------------------------------------
// PRIVATE HELPERS
// -----------------------------------------------------------------------------

function _buildAclRolePermissions(): TAclPermissionKeyByResource {
  const out = {} as Record<
    AclResource,
    Readonly<Record<AclRole, readonly TAclPermissionKey[]>>
  >;

  const _RESOURCES = [...Object.values(AclResource)] as const;
  const _ROLES = Object.values(AclRole) as readonly AclRole[];
  for (const resource of _RESOURCES) {
    const byRole = {} as Record<AclRole, readonly TAclPermissionKey[]>;
    for (const role of _ROLES) {
      byRole[role] = Object.freeze(
        ACL_LEVELS[resource][role].map(
          (action) => PERMISSION[resource][action],
        ),
      );
    }
    out[resource] = Object.freeze(byRole);
  }

  return Object.freeze(out);
}
