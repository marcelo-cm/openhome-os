# Permission System

A comprehensive dual-layer permission system combining **Role-Based Access Control (RBAC)** and **Access Control Lists (ACL)** for fine-grained authorization.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Usage Patterns](#usage-patterns)
- [API Integration](#api-integration)
- [UI Integration](#ui-integration)
- [Extending the System](#extending-the-system)
- [Architecture](#architecture)
- [Testing](#testing)

## Overview

This permission system provides two complementary authorization layers:

- **RBAC (Role-Based Access Control)**: Broad permissions scoped to organizations, projects, or globally
- **ACL (Access Control Lists)**: Fine-grained permissions on individual resource instances

### Key Features

- **Dual-layer authorization** with flexible OR/AND logic
- **Super Admin bypass** for unrestricted access
- **Type-safe permission keys** with full TypeScript support
- **Extensible architecture** for adding new resources, actions, and roles
- **Comprehensive test coverage** with real-world scenarios

## Quick Start

```typescript
import {
  AclResource,
  AclRole,
  RbacResource,
  RbacRole,
  ResourceAction,
} from './enums';
import { PERMISSION } from './permission-keys';
import { can } from './permission-utils';

// Check if a user can delete a post
const canDeletePost = can(
  PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
  {
    rbacResource: RbacResource.PROJECT,
    rbacRole: RbacRole.MEMBER,
    aclResource: AclResource.LOCATION,
    aclRole: AclRole.OWNER,
    isSuperAdmin: false,
  },
);
// Returns: true (either RBAC or ACL grants permission)
```

## Core Concepts

### Resources

Resources are the entities that permissions are applied to:

- **RBAC Resources**: Organization-wide or project-wide resources
  - `RbacResource.ORG` - Organization
  - `RbacResource.PROJECT` - Project

- **ACL Resources**: Instance-specific resources
  - `AclResource.LOCATION` - Individual posts

### Actions

Actions define what operations can be performed:

- **Universal Actions** (apply to all resources):
  - `ResourceAction.READ` - View a resource
  - `ResourceAction.CREATE` - Create new resources
  - `ResourceAction.UPDATE` - Modify existing resources
  - `ResourceAction.DELETE` - Remove resources
  - `ResourceAction.LIST` - View multiple resources

- **RBAC-specific Actions**:
  - `RbacResourceAction.ADD_MEMBERSHIP` - Add members
  - `RbacResourceAction.REMOVE_MEMBERSHIP` - Remove members
  - `RbacResourceAction.ADD_ADMIN` - Grant admin role
  - `RbacResourceAction.REMOVE_ADMIN` - Revoke admin role

- **ACL-specific Actions**:
  - `AclResourceAction.ADD_EDITOR` - Grant editor access
  - `AclResourceAction.REMOVE_EDITOR` - Revoke editor access
  - `AclResourceAction.ADD_VIEWER` - Grant viewer access
  - `AclResourceAction.REMOVE_VIEWER` - Revoke viewer access

### Roles

Roles define bundles of permissions:

- **RBAC Roles**:
  - `RbacRole.SUPER_ADMIN` - Global unrestricted access
  - `RbacRole.ADMIN` - High-level control within scope
  - `RbacRole.MEMBER` - Standard access within scope

- **ACL Roles**:
  - `AclRole.OWNER` - Full control over resource instance
  - `AclRole.EDITOR` - Can modify resource instance
  - `AclRole.VIEWER` - Can only view resource instance

## Usage Patterns

### Basic Permission Check

```typescript
// RBAC-only check
const canManageOrg = can(PERMISSION[RbacResource.ORG][ResourceAction.UPDATE], {
  rbacResource: RbacResource.ORG,
  rbacRole: RbacRole.ADMIN,
});

// ACL-only check
const canEditPost = can(
  PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE],
  {
    aclResource: AclResource.LOCATION,
    aclRole: AclRole.EDITOR,
  },
);
```

### Combined RBAC + ACL Checks

```typescript
// OR logic (default) - either system can grant permission
const canDeletePost = can(
  PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
  {
    rbacResource: RbacResource.PROJECT,
    rbacRole: RbacRole.MEMBER, // Can delete via RBAC
    aclResource: AclResource.LOCATION,
    aclRole: AclRole.VIEWER, // Cannot delete via ACL
    // Result: true (RBAC grants permission)
  },
);

// AND logic - both systems must grant permission
const strictCheck = can(
  PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE],
  {
    rbacResource: RbacResource.PROJECT,
    rbacRole: RbacRole.MEMBER, // Can update via RBAC
    aclResource: AclResource.LOCATION,
    aclRole: AclRole.EDITOR, // Can update via ACL
    mode: 'all', // Require both
    // Result: true (both systems grant permission)
  },
);
```

### Super Admin Bypass

```typescript
// Super admins bypass all permission checks
const superAdminCheck = can(
  PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
  {
    rbacResource: RbacResource.PROJECT,
    rbacRole: RbacRole.MEMBER,
    aclResource: AclResource.LOCATION,
    aclRole: AclRole.VIEWER,
    isSuperAdmin: true, // Bypasses all checks
    // Result: true (super admin override)
  },
);
```

## API Integration

### Server Actions

```typescript
// user-actions.ts
import { PERMISSION } from '@/models/permissions/permission-keys';
import { can } from '@/models/permissions/permission-utils';

export async function deletePost(postId: string, userId: string) {
  // Get user's roles and context
  const userContext = await getUserPermissionContext(userId, postId);

  // Check permission
  const hasPermission = can(
    PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
    {
      rbacResource: userContext.rbacResource,
      rbacRole: userContext.rbacRole,
      aclResource: AclResource.LOCATION,
      aclRole: userContext.aclRole,
      isSuperAdmin: userContext.isSuperAdmin,
    },
  );

  if (!hasPermission) {
    throw new Error('Insufficient permissions to delete post');
  }

  // Proceed with deletion
  await db.delete(posts).where(eq(posts.id, postId));
}
```

### API Route Handlers

```typescript
// app/api/posts/[id]/route.ts
import { PERMISSION } from '@/models/permissions/permission-keys';
import { can } from '@/models/permissions/permission-utils';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  const postId = params.id;

  // Get permission context
  const context = await getPermissionContext(user.id, postId);

  // Check permission
  const canDelete = can(
    PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
    context,
  );

  if (!canDelete) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Handle deletion
  await deletePost(postId);
  return Response.json({ success: true });
}
```

### Middleware Integration

```typescript
// middleware/permissions.ts
export function requirePermission(
  permission: string,
  getContext: (req: Request) => Promise<PermissionContext>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const context = await getContext(req);

    if (!can(permission, context)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Usage
app.delete(
  '/api/posts/:id',
  requirePermission(
    PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
    getPostPermissionContext,
  ),
  deletePostHandler,
);
```

## UI Integration

### React Components

```typescript
// components/PostActions.tsx
import { can } from '@/models/permissions/permission-utils';
import { PERMISSION } from '@/models/permissions/permission-keys';
import { usePermissionContext } from '@/hooks/use-permission-context';

export function PostActions({ post }: { post: Post }) {
  const context = usePermissionContext(post.id);

  const canEdit = can(
    PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE],
    context
  );

  const canDelete = can(
    PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
    context
  );

  return (
    <div className="flex gap-2">
      {canEdit && (
        <Button onClick={() => editPost(post.id)}>
          Edit
        </Button>
      )}
      {canDelete && (
        <Button
          variant="destructive"
          onClick={() => deletePost(post.id)}
        >
          Delete
        </Button>
      )}
    </div>
  );
}
```

### Permission Hook

```typescript
// hooks/use-permission.ts
import { can } from '@/models/permissions/permission-utils';
import { usePermissionContext } from './use-permission-context';

export function usePermission(permission: string, resourceId?: string) {
  const context = usePermissionContext(resourceId);
  return can(permission, context);
}

// Usage in components
export function PostCard({ post }: { post: Post }) {
  const canDelete = usePermission(
    PERMISSION[AclResource.LOCATION][ResourceAction.DELETE],
    post.id
  );

  return (
    <Card>
      <CardContent>{post.content}</CardContent>
      {canDelete && (
        <CardActions>
          <Button onClick={() => handleDelete(post.id)}>Delete</Button>
        </CardActions>
      )}
    </Card>
  );
}
```

### Conditional Rendering

```typescript
// components/PermissionGate.tsx
interface PermissionGateProps {
  permission: string;
  resourceId?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  permission,
  resourceId,
  children,
  fallback = null
}: PermissionGateProps) {
  const hasPermission = usePermission(permission, resourceId);

  return hasPermission ? children : fallback;
}

// Usage
<PermissionGate
  permission={PERMISSION[AclResource.LOCATION][ResourceAction.DELETE]}
  resourceId={post.id}
>
  <DeleteButton postId={post.id} />
</PermissionGate>
```

## Extending the System

### Adding New Resources

#### 1. Define the Resource Enum

```typescript
// rbac-enums.ts or acl-enums.ts
export enum RbacResource {
  ORG = 'organization',
  PROJECT = 'project',
  TEAM = 'team', // New RBAC resource
}

// or for ACL
export enum AclResource {
  POST = 'post',
  DOCUMENT = 'document', // New ACL resource
}
```

#### 2. Update Permission Matrix

```typescript
// rbac-resource-permissions.ts
export const PERMISSION_MATRIX: TPermissionMatrix = Object.fromEntries([
  // ... existing resources
  ...Object.values(RbacResource).map((resource) => [
    resource,
    _buildAllActions('rbac'),
  ]),
]) satisfies TPermissionMatrix;
```

#### 3. Update Permission Keys

```typescript
// permission-keys.ts
export const PERMISSION = Object.freeze({
  [RbacResource.ORG]: _buildResourcePermissions(RbacResource.ORG),
  [RbacResource.PROJECT]: _buildResourcePermissions(RbacResource.PROJECT),
  [RbacResource.TEAM]: _buildResourcePermissions(RbacResource.TEAM), // New
  [AclResource.LOCATION]: _buildResourcePermissions(AclResource.LOCATION),
  [AclResource.DOCUMENT]: _buildResourcePermissions(AclResource.DOCUMENT), // New
}) satisfies TPermissionKeyByResource;
```

#### 4. Define Role Permissions

```typescript
// rbac-roles.ts
export const RBAC_ROLE_PERMISSIONS_BY_RESOURCE: TRbacRolePermissionMatrix = {
  // ... existing resources
  [RbacResource.TEAM]: {
    [RbacRole.ADMIN]: composeRole(
      PERMISSION[RbacResource.TEAM][ResourceAction.READ],
      PERMISSION[RbacResource.TEAM][ResourceAction.UPDATE],
      PERMISSION[RbacResource.TEAM][ResourceAction.DELETE],
      // ... other permissions
    ),
    [RbacRole.MEMBER]: composeRole(
      PERMISSION[RbacResource.TEAM][ResourceAction.READ],
    ),
  },
};

// acl-roles.ts
export const ACL_LEVELS = {
  // ... existing resources
  [AclResource.DOCUMENT]: {
    [AclRole.VIEWER]: [ResourceAction.READ],
    [AclRole.EDITOR]: [ResourceAction.READ, ResourceAction.UPDATE],
    [AclRole.OWNER]: [
      ResourceAction.READ,
      ResourceAction.UPDATE,
      ResourceAction.DELETE,
    ],
  },
} as const;
```

### Adding New Actions

#### 1. Define Action Enum

```typescript
// rbac-enums.ts
export enum RbacResourceAction {
  ADD_MEMBERSHIP = 'addMembership',
  REMOVE_MEMBERSHIP = 'removeMembership',
  ADD_ADMIN = 'addAdmin',
  REMOVE_ADMIN = 'removeAdmin',
  ARCHIVE = 'archive', // New action
  RESTORE = 'restore', // New action
}

// acl-enums.ts
export enum AclResourceAction {
  ADD_EDITOR = 'addEditor',
  REMOVE_EDITOR = 'removeEditor',
  ADD_VIEWER = 'addViewer',
  REMOVE_VIEWER = 'removeViewer',
  SHARE = 'share', // New action
  UNSHARE = 'unshare', // New action
}
```

#### 2. Update Role Permissions

```typescript
// rbac-roles.ts
[RbacResource.PROJECT]: {
  [RbacRole.ADMIN]: composeRole(
    // ... existing permissions
    PERMISSION[RbacResource.PROJECT][RbacResourceAction.ARCHIVE],  // New
    PERMISSION[RbacResource.PROJECT][RbacResourceAction.RESTORE],  // New
  ),
},

// acl-roles.ts
[AclResource.LOCATION]: {
  [AclRole.OWNER]: [
    // ... existing actions
    AclResourceAction.SHARE,    // New
    AclResourceAction.UNSHARE,  // New
  ],
},
```

### Adding New Roles

#### 1. Define Role Enum

```typescript
// rbac-enums.ts
export enum RbacRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest', // New role
}

// acl-enums.ts
export enum AclRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  COMMENTER = 'commenter', // New role
}
```

#### 2. Update Type Definitions

```typescript
// permission-types.ts
export type NonSuperAdminRole = Exclude<RbacRole, RbacRole.SUPER_ADMIN>;
// This will automatically include the new GUEST role
```

#### 3. Define Role Permissions

```typescript
// rbac-roles.ts
[RbacResource.PROJECT]: {
  [RbacRole.ADMIN]: composeRole(/* admin permissions */),
  [RbacRole.MEMBER]: composeRole(/* member permissions */),
  [RbacRole.GUEST]: composeRole(                      // New role
    PERMISSION[RbacResource.PROJECT][ResourceAction.READ],
  ),
},

// acl-roles.ts
[AclResource.LOCATION]: {
  [AclRole.OWNER]: [/* owner actions */],
  [AclRole.EDITOR]: [/* editor actions */],
  [AclRole.VIEWER]: [/* viewer actions */],
  [AclRole.COMMENTER]: [                             // New role
    ResourceAction.READ,
    AclResourceAction.ADD_COMMENT,
  ],
},
```

### Best Practices for Extensions

1. **Follow Naming Conventions**:
   - Resources: Singular nouns (`POST`, `DOCUMENT`)
   - Actions: Verbs (`CREATE`, `UPDATE`, `ARCHIVE`)
   - Roles: Descriptive titles (`ADMIN`, `EDITOR`, `GUEST`)

2. **Maintain Type Safety**:
   - Always update type definitions when adding new enums
   - Use `satisfies` to ensure type constraints are met
   - Run TypeScript compiler to catch type errors

3. **Update Tests**:
   - Add test cases for new resources, actions, and roles
   - Test permission combinations thoroughly
   - Include edge cases and real-world scenarios

4. **Document Changes**:
   - Update this README when adding new concepts
   - Add JSDoc comments for complex permission logic
   - Include usage examples for new features

## Architecture

### File Structure

```
models/permissions/
├── __tests__/
│   └── permission-utils.test.ts    # Comprehensive test suite
├── acl-enums.ts                    # ACL resources, roles, actions
├── acl-roles.ts                    # ACL role permission mappings
├── acl-types.ts                    # ACL type definitions
├── permission-enums.ts             # Universal actions
├── permission-keys.ts              # Permission key generation
├── permission-types.ts             # Core type definitions
├── permission-utils.ts             # Main permission checking logic
├── rbac-enums.ts                   # RBAC resources, roles, actions
├── rbac-resource-permissions.ts    # Resource-action matrix
├── rbac-roles.ts                   # RBAC role permission mappings
├── rbac-types.ts                   # RBAC type definitions
├── rbac-utils.ts                   # RBAC utility functions
└── README.md                       # This file
```

### Permission Key Format

Permission keys follow the format: `{action}:{resource}`

Examples:

- `read:post` - Read a post
- `update:organization` - Update an organization
- `addMembership:project` - Add membership to a project

### Evaluation Logic

1. **Super Admin Check**: If `isSuperAdmin` is true, grant permission immediately
2. **System Availability**: Check which permission systems (RBAC/ACL) are provided
3. **Permission Lookup**: Get permissions from each available system
4. **Mode Application**: Apply OR logic (default) or AND logic based on `mode` parameter

## Testing

The system includes comprehensive tests covering:

- **Super Admin bypass** scenarios
- **RBAC-only** permission checks
- **ACL-only** permission checks
- **Combined RBAC+ACL** with both OR and AND logic
- **Real-world scenarios** like post deletion, updates, and creation
- **Edge cases** and error handling

### Running Tests

```bash
pnpm run test models/permissions
```

### Example Test Case

```typescript
it('should allow project member to delete post even as editor', () => {
  const permission = PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

  expect(
    can(permission, {
      rbacResource: RbacResource.PROJECT,
      rbacRole: RbacRole.MEMBER, // RBAC grants delete
      aclResource: AclResource.LOCATION,
      aclRole: AclRole.EDITOR, // ACL denies delete
      isSuperAdmin: false,
    }),
  ).toBe(true); // OR logic allows RBAC to grant permission
});
```

---

## Summary

This permission system provides a robust, type-safe, and extensible foundation for authorization in your application. The dual-layer approach allows for both broad organizational permissions (RBAC) and fine-grained instance-level control (ACL), giving you the flexibility to handle complex permission scenarios while maintaining simplicity for common use cases.

For questions or contributions, please refer to the test suite for examples and edge cases, or consult the type definitions for detailed API documentation.
