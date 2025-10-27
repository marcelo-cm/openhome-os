import { AclResource, AclResourceAction } from './acl-enums';
import { ResourceAction } from './permission-enums';
import {
  TActionsFor,
  TPermissionMatrix,
  TResourceKind,
} from './permission-types';
import { RbacResource, RbacResourceAction } from './rbac-enums';

/**
 * Defines which actions are valid for each resource type.
 *
 * Use this to constrain what actions can be performed on each resource.
 * The LEVELS definition is validated against this matrix at compile time.
 *
 * @example PERMISSION_MATRIX[AclResource.LOCATION] // => [ResourceAction.READ, ResourceAction.CREATE, ...]
 */
export const PERMISSION_MATRIX: TPermissionMatrix = Object.fromEntries([
  ...Object.values(RbacResource).map((resource) => [
    resource,
    _buildAllActions('rbac'),
  ]),
  ...Object.values(AclResource).map((resource) => [
    resource,
    _buildAllActions('acl'),
  ]),
]) satisfies TPermissionMatrix;

// -----------------------------------------------------------------------------
// PRIVATE HELPERS
// -----------------------------------------------------------------------------

function _buildAllActions<const K extends TResourceKind>(
  kind: K,
): TActionsFor<K> {
  // Note: Object.values on string enums returns their values (fine here).
  // If you use numeric enums, filter out numbers.
  const base = Object.values(ResourceAction);
  const extra =
    kind === 'rbac'
      ? Object.values(RbacResourceAction)
      : Object.values(AclResourceAction);

  // Concatenate & freeze to emphasize read-only intent
  return [...base, ...extra] as TActionsFor<K>;
}
