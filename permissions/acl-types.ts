import { AclResource, AclResourceAction, AclRole } from './acl-enums';
import { ResourceAction } from './permission-enums';
import { TPermissionKey } from './permission-types';
import { PERMISSION_MATRIX } from './rbac-resource-permissions';

export type TAclPermissionKey = TPermissionKey<AclResource, AclActions>;
export type AclActions = ResourceAction | AclResourceAction;

export type TAllowedAclLevelActions<R extends AclResource> = Exclude<
  (typeof PERMISSION_MATRIX)[R][number],
  ResourceAction.CREATE | ResourceAction.LIST
>;

export type TAclPermissionKeyByResource = Readonly<
  Record<AclResource, Readonly<Record<AclRole, readonly TAclPermissionKey[]>>>
>;
