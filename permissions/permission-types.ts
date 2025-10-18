import { AclResource, AclResourceAction } from './acl-enums';
import { AclActions, TAclPermissionKey } from './acl-types';
import { ResourceAction } from './permission-enums';
import { RbacResource, RbacResourceAction } from './rbac-enums';
import { RbacActions, TRbacPermissionKey } from './rbac-types';

/** Canonical unions */
export type AnyResource = RbacResource | AclResource;
export type AnyAction = RbacActions | AclActions;

export type TPermissionKey<
  R extends AnyResource = AnyResource,
  A extends AnyAction = AnyAction,
> = Readonly<`${A}:${R}`>;

export type TResourceKind = 'rbac' | 'acl';

export type TPermissionMatrix = Record<
  RbacResource | AclResource,
  TActionsFor<TResourceKind>
>;

export type TActionsFor<K extends TResourceKind> = K extends 'rbac'
  ? ReadonlyArray<RbacActions>
  : ReadonlyArray<AclActions>;

export type TPermissionKeyByResource = Readonly<
  | Record<
      RbacResource,
      Readonly<Record<ResourceAction | RbacResourceAction, TRbacPermissionKey>>
    >
  | Record<
      AclResource,
      Readonly<Record<AclResourceAction | ResourceAction, TAclPermissionKey>>
    >
>;
