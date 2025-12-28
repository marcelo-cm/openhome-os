import { ResourceAction } from './permission-enums';
import { AnyResource, TPermissionKey } from './permission-types';
import { RbacResource, RbacResourceAction, RbacRole } from './rbac-enums';

export type RbacActions = ResourceAction | RbacResourceAction;

export type TRbacPermissionKey = TPermissionKey<RbacResource, RbacActions>;

export type TRbacRolePermissionMatrix = Readonly<
  Record<
    RbacResource,
    Readonly<
      Record<RbacRole, readonly TPermissionKey<AnyResource, RbacActions>[]>
    >
  >
>;
