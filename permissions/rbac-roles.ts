import { AclResource } from './acl-enums';
import { ResourceAction } from './permission-enums';
import { PERMISSION } from './permission-keys';
import { RbacResource, RbacResourceAction, RbacRole } from './rbac-enums';
import { TRbacRolePermissionMatrix } from './rbac-types';
import { composeRole } from './rbac-utils';

/**
 * Defines what a role can do under certain conditions (ie. they are a member of an organization).
 *
 * Use this to get all permissions that a role grants across the entire app.
 * For context-bound checks, combine with ACL permissions using intersection.
 *
 * @criteria If they only have this role, what can they do?
 *
 * @example ROLES[RbacResource.ORG][RbacRole.ADMIN] // => ['read:organization', 'update:organization', ...]
 */
export const RBAC_ROLE_PERMISSIONS_BY_RESOURCE: TRbacRolePermissionMatrix = {
  [RbacResource.ORG]: {
    [RbacRole.ADMIN]: composeRole(
      PERMISSION[RbacResource.ORG][ResourceAction.READ],
      PERMISSION[RbacResource.ORG][ResourceAction.UPDATE],
      PERMISSION[RbacResource.ORG][RbacResourceAction.ADD_MEMBERSHIP],
      PERMISSION[RbacResource.ORG][RbacResourceAction.REMOVE_MEMBERSHIP],
      PERMISSION[RbacResource.ORG][RbacResourceAction.ADD_ADMIN],
      PERMISSION[RbacResource.ORG][RbacResourceAction.REMOVE_ADMIN],

      PERMISSION[RbacResource.PROJECT][ResourceAction.CREATE],
      PERMISSION[RbacResource.PROJECT][ResourceAction.READ],
      PERMISSION[RbacResource.PROJECT][ResourceAction.UPDATE],
      PERMISSION[RbacResource.PROJECT][ResourceAction.DELETE],
      PERMISSION[RbacResource.PROJECT][ResourceAction.LIST],
      PERMISSION[RbacResource.PROJECT][RbacResourceAction.ADD_MEMBERSHIP],
      PERMISSION[RbacResource.PROJECT][RbacResourceAction.REMOVE_MEMBERSHIP],
      PERMISSION[RbacResource.PROJECT][RbacResourceAction.ADD_ADMIN],
      PERMISSION[RbacResource.PROJECT][RbacResourceAction.REMOVE_ADMIN],
    ),
    [RbacRole.MEMBER]: composeRole(
      PERMISSION[RbacResource.ORG][ResourceAction.READ],
    ),
  },
  [RbacResource.PROJECT]: {
    [RbacRole.ADMIN]: composeRole(
      PERMISSION[RbacResource.PROJECT][ResourceAction.READ],
      PERMISSION[RbacResource.PROJECT][ResourceAction.UPDATE],
      PERMISSION[RbacResource.PROJECT][ResourceAction.DELETE],
      PERMISSION[RbacResource.PROJECT][ResourceAction.LIST],
      PERMISSION[RbacResource.PROJECT][RbacResourceAction.ADD_MEMBERSHIP],
      PERMISSION[RbacResource.PROJECT][RbacResourceAction.REMOVE_MEMBERSHIP],
      PERMISSION[RbacResource.PROJECT][RbacResourceAction.ADD_ADMIN],
      PERMISSION[RbacResource.PROJECT][RbacResourceAction.REMOVE_ADMIN],

      PERMISSION[AclResource.LOCATION][ResourceAction.CREATE],
      PERMISSION[AclResource.LOCATION][ResourceAction.READ],
      PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE],
      PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
      PERMISSION[AclResource.LOCATION][ResourceAction.LIST],
    ),
    [RbacRole.MEMBER]: composeRole(
      PERMISSION[RbacResource.PROJECT][ResourceAction.READ],

      PERMISSION[AclResource.LOCATION][ResourceAction.CREATE],
      PERMISSION[AclResource.LOCATION][ResourceAction.READ],
      PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE],
      PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
      PERMISSION[AclResource.LOCATION][ResourceAction.LIST],
    ),
  },
};
