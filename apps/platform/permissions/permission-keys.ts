import { AclResource } from './acl-enums';
import { TPermissionKeyByResource } from './permission-types';
import { RbacResource } from './rbac-enums';
import { PERMISSION_MATRIX } from './rbac-resource-permissions';

/**
 * Maps resources and actions to their canonical permission key strings.
 *
 * Use this to get the exact permission key for any resource/action combination.
 *
 * @example PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE] // => "update:post"
 */
export const PERMISSION = Object.freeze({
  [RbacResource.ORG]: _buildResourcePermissions(RbacResource.ORG),
  [RbacResource.PROJECT]: _buildResourcePermissions(RbacResource.PROJECT),
  [AclResource.LOCATION]: _buildResourcePermissions(AclResource.LOCATION),
}) satisfies TPermissionKeyByResource;

/**
 * Builds the permission map for a resource in a type-safe way.
 *
 * @example buildResourcePermissions(RbacResource.PROJECT) // => { read: 'read:project', create: 'create:project', ... }
 */
function _buildResourcePermissions<R extends keyof typeof PERMISSION_MATRIX>(
  resource: R,
) {
  const actions = PERMISSION_MATRIX[resource];
  return Object.freeze(
    Object.fromEntries(
      actions.map((a) => [a, `${a}:${resource}` as const]),
    ) as {
      readonly [K in (typeof actions)[number]]: `${K & string}:${R & string}`;
    },
  );
}
