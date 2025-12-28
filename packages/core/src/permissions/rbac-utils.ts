import { AclResource } from './acl-enums';
import { ResourceAction } from './permission-enums';
import { TPermissionKey } from './permission-types';
import { TRbacPermissionKey } from './rbac-types';

export function composeRole(
  ...chunks: _Chunk[]
): readonly (
  | TRbacPermissionKey
  | TPermissionKey<AclResource, ResourceAction>
)[] {
  const set = new Set<
    TRbacPermissionKey | TPermissionKey<AclResource, ResourceAction>
  >();
  for (const c of chunks) {
    if (Array.isArray(c)) for (const k of c) set.add(k);
    else
      set.add(
        c as TRbacPermissionKey | TPermissionKey<AclResource, ResourceAction>,
      );
  }
  return Object.freeze(Array.from(set));
}

type _Chunk =
  | readonly (
      | TRbacPermissionKey
      | TPermissionKey<AclResource, ResourceAction>
    )[]
  | TRbacPermissionKey
  | TPermissionKey<AclResource, ResourceAction>;
