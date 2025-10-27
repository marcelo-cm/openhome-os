import { AclResource, AclResourceAction, AclRole } from '../acl-enums';
import { ResourceAction } from '../permission-enums';
import { PERMISSION } from '../permission-keys';
import { TPermissionKey } from '../permission-types';
import { can } from '../permission-utils';
import { RbacResource, RbacResourceAction } from '../rbac-enums';
import { RbacRole } from '../rbac-enums';

describe('can() utility', () => {
  describe('Super Admin bypass', () => {
    it('should allow super admin to perform any action on RBAC resources', () => {
      // Test all RBAC resources
      [RbacResource.ORG, RbacResource.PROJECT].forEach((resource) => {
        // Test all possible actions
        Object.values(ResourceAction).forEach((action) => {
          const permission = PERMISSION[resource][action];
          expect(
            can(permission, {
              rbacResource: resource,
              rbacRole: RbacRole.MEMBER, // Doesn't matter what role
              isSuperAdmin: true,
            }),
          ).toBe(true);
        });

        Object.values(RbacResourceAction).forEach((action) => {
          const permission = PERMISSION[resource][action];
          expect(
            can(permission, {
              rbacResource: resource,
              rbacRole: RbacRole.MEMBER,
              isSuperAdmin: true,
            }),
          ).toBe(true);
        });
      });
    });

    it('should allow super admin to perform any action on ACL resources', () => {
      // Test all actions on POST resource
      Object.values(ResourceAction).forEach((action) => {
        const permission = PERMISSION[AclResource.LOCATION][action];
        expect(
          can(permission, {
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER, // Doesn't matter what role
            isSuperAdmin: true,
          }),
        ).toBe(true);
      });

      Object.values(AclResourceAction).forEach((action) => {
        const permission = PERMISSION[AclResource.LOCATION][action];
        expect(
          can(permission, {
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER,
            isSuperAdmin: true,
          }),
        ).toBe(true);
      });
    });

    it('should allow super admin with both RBAC and ACL contexts', () => {
      const permission =
        PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

      expect(
        can(permission, {
          rbacResource: RbacResource.PROJECT,
          rbacRole: RbacRole.MEMBER,
          aclResource: AclResource.LOCATION,
          aclRole: AclRole.VIEWER,
          isSuperAdmin: true,
          mode: 'all', // Even with 'all' mode, super admin bypasses
        }),
      ).toBe(true);
    });
  });

  describe('RBAC-only permissions', () => {
    describe('Organization Admin', () => {
      it('should allow read and update organization actions', () => {
        const adminActions = [
          ResourceAction.READ,
          ResourceAction.UPDATE,
          RbacResourceAction.ADD_MEMBERSHIP,
          RbacResourceAction.REMOVE_MEMBERSHIP,
          RbacResourceAction.ADD_ADMIN,
          RbacResourceAction.REMOVE_ADMIN,
        ];

        adminActions.forEach((action) => {
          const permission = PERMISSION[RbacResource.ORG][action];
          expect(
            can(permission, {
              rbacResource: RbacResource.ORG,
              rbacRole: RbacRole.ADMIN,
              isSuperAdmin: false,
            }),
          ).toBe(true);
        });
      });

      it('should NOT allow create, delete, or list organization actions', () => {
        const restrictedActions = [
          ResourceAction.CREATE,
          ResourceAction.DELETE,
          ResourceAction.LIST,
        ];

        restrictedActions.forEach((action) => {
          const permission = PERMISSION[RbacResource.ORG][action];
          expect(
            can(permission, {
              rbacResource: RbacResource.ORG,
              rbacRole: RbacRole.ADMIN,
              isSuperAdmin: false,
            }),
          ).toBe(false);
        });
      });

      it('should allow all project actions at organization level', () => {
        const projectActions = [
          ResourceAction.READ,
          ResourceAction.CREATE,
          ResourceAction.UPDATE,
          ResourceAction.DELETE,
          ResourceAction.LIST,
          RbacResourceAction.ADD_MEMBERSHIP,
          RbacResourceAction.REMOVE_MEMBERSHIP,
          RbacResourceAction.ADD_ADMIN,
          RbacResourceAction.REMOVE_ADMIN,
        ];

        projectActions.forEach((action) => {
          const permission = PERMISSION[RbacResource.PROJECT][action];
          expect(
            can(permission, {
              rbacResource: RbacResource.ORG,
              rbacRole: RbacRole.ADMIN,
              isSuperAdmin: false,
            }),
          ).toBe(true);
        });
      });
    });

    describe('Organization Member', () => {
      it('should only allow read access to organization', () => {
        expect(
          can(PERMISSION[RbacResource.ORG][ResourceAction.READ], {
            rbacResource: RbacResource.ORG,
            rbacRole: RbacRole.MEMBER,
            isSuperAdmin: false,
          }),
        ).toBe(true);

        // Should not allow other actions
        const restrictedActions = [
          ResourceAction.CREATE,
          ResourceAction.UPDATE,
          ResourceAction.DELETE,
          ResourceAction.LIST,
          RbacResourceAction.ADD_MEMBERSHIP,
          RbacResourceAction.REMOVE_MEMBERSHIP,
          RbacResourceAction.ADD_ADMIN,
          RbacResourceAction.REMOVE_ADMIN,
        ];

        restrictedActions.forEach((action) => {
          const permission = PERMISSION[RbacResource.ORG][action];
          expect(
            can(permission, {
              rbacResource: RbacResource.ORG,
              rbacRole: RbacRole.MEMBER,
              isSuperAdmin: false,
            }),
          ).toBe(false);
        });
      });
    });

    describe('Project Admin', () => {
      it('should allow all project actions', () => {
        const projectActions = [
          ResourceAction.READ,
          ResourceAction.UPDATE,
          ResourceAction.DELETE,
          ResourceAction.LIST,
          RbacResourceAction.ADD_MEMBERSHIP,
          RbacResourceAction.REMOVE_MEMBERSHIP,
          RbacResourceAction.ADD_ADMIN,
          RbacResourceAction.REMOVE_ADMIN,
        ];

        projectActions.forEach((action) => {
          const permission = PERMISSION[RbacResource.PROJECT][action];
          expect(
            can(permission, {
              rbacResource: RbacResource.PROJECT,
              rbacRole: RbacRole.ADMIN,
              isSuperAdmin: false,
            }),
          ).toBe(true);
        });
      });
    });

    describe('Project Member', () => {
      it('should allow read access to project', () => {
        expect(
          can(PERMISSION[RbacResource.PROJECT][ResourceAction.READ], {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER,
            isSuperAdmin: false,
          }),
        ).toBe(true);
      });

      it('should NOT allow project management actions', () => {
        const restrictedActions = [
          ResourceAction.CREATE,
          ResourceAction.UPDATE,
          ResourceAction.DELETE,
          ResourceAction.LIST,
          RbacResourceAction.ADD_MEMBERSHIP,
          RbacResourceAction.REMOVE_MEMBERSHIP,
          RbacResourceAction.ADD_ADMIN,
          RbacResourceAction.REMOVE_ADMIN,
        ];

        restrictedActions.forEach((action) => {
          const permission = PERMISSION[RbacResource.PROJECT][action];
          expect(
            can(permission, {
              rbacResource: RbacResource.PROJECT,
              rbacRole: RbacRole.MEMBER,
              isSuperAdmin: false,
            }),
          ).toBe(false);
        });
      });

      it('should allow all POST actions', () => {
        const postActions = [
          ResourceAction.CREATE,
          ResourceAction.READ,
          ResourceAction.UPDATE,
          ResourceAction.DELETE,
          ResourceAction.LIST,
        ];

        postActions.forEach((action) => {
          const permission = PERMISSION[AclResource.LOCATION][action];
          expect(
            can(permission, {
              rbacResource: RbacResource.PROJECT,
              rbacRole: RbacRole.MEMBER,
              isSuperAdmin: false,
            }),
          ).toBe(true);
        });
      });
    });
  });

  describe('ACL-only permissions', () => {
    describe('Post Owner', () => {
      it('should allow read, update, and delete post actions', () => {
        const ownerActions = [
          ResourceAction.READ,
          ResourceAction.UPDATE,
          ResourceAction.DELETE,
        ];

        ownerActions.forEach((action) => {
          const permission = PERMISSION[AclResource.LOCATION][action];
          expect(
            can(permission, {
              aclResource: AclResource.LOCATION,
              aclRole: AclRole.OWNER,
              isSuperAdmin: false,
            }),
          ).toBe(true);
        });
      });

      it('should NOT allow ACL management or other actions', () => {
        const restrictedActions = [ResourceAction.CREATE, ResourceAction.LIST];

        restrictedActions.forEach((action) => {
          const permission = PERMISSION[AclResource.LOCATION][action];
          expect(
            can(permission, {
              aclResource: AclResource.LOCATION,
              aclRole: AclRole.OWNER,
              isSuperAdmin: false,
            }),
          ).toBe(false);
        });
      });
    });

    describe('Post Editor', () => {
      it('should allow read and update actions', () => {
        // Allowed actions
        const allowedActions = [ResourceAction.READ, ResourceAction.UPDATE];

        allowedActions.forEach((action) => {
          const permission = PERMISSION[AclResource.LOCATION][action];
          expect(
            can(permission, {
              aclResource: AclResource.LOCATION,
              aclRole: AclRole.EDITOR,
              isSuperAdmin: false,
            }),
          ).toBe(true);
        });
      });

      it('should NOT allow delete or ACL management actions', () => {
        const restrictedActions = [
          ResourceAction.CREATE,
          ResourceAction.DELETE,
          ResourceAction.LIST,
        ];

        restrictedActions.forEach((action) => {
          const permission = PERMISSION[AclResource.LOCATION][action];
          expect(
            can(permission, {
              aclResource: AclResource.LOCATION,
              aclRole: AclRole.EDITOR,
              isSuperAdmin: false,
            }),
          ).toBe(false);
        });
      });
    });

    describe('Post Viewer', () => {
      it('should only allow read access', () => {
        expect(
          can(PERMISSION[AclResource.LOCATION][ResourceAction.READ], {
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER,
            isSuperAdmin: false,
          }),
        ).toBe(true);

        // All other actions should be restricted
        const restrictedActions = [
          ResourceAction.CREATE,
          ResourceAction.UPDATE,
          ResourceAction.DELETE,
          ResourceAction.LIST,
          AclResourceAction.ADD_EDITOR,
          AclResourceAction.REMOVE_EDITOR,
          AclResourceAction.ADD_VIEWER,
          AclResourceAction.REMOVE_VIEWER,
        ];

        restrictedActions.forEach((action) => {
          const permission = PERMISSION[AclResource.LOCATION][action];
          expect(
            can(permission, {
              aclResource: AclResource.LOCATION,
              aclRole: AclRole.VIEWER,
              isSuperAdmin: false,
            }),
          ).toBe(false);
        });
      });
    });
  });

  describe('Combined RBAC and ACL permissions', () => {
    describe('mode: "any" (OR logic - default)', () => {
      it('should allow action if RBAC grants permission even if ACL denies', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.ADMIN, // Admin can delete
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER, // Viewer cannot delete
            isSuperAdmin: false,
            // mode defaults to 'any'
          }),
        ).toBe(true);
      });

      it('should allow action if ACL grants permission even if RBAC denies', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER, // Member cannot delete
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.OWNER, // Owner can delete
            isSuperAdmin: false,
          }),
        ).toBe(true);
      });

      it('should deny action if both RBAC and ACL deny', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.ORG, // Org member cannot delete posts
            rbacRole: RbacRole.MEMBER, // Member cannot delete at org level
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER, // Viewer cannot delete
            isSuperAdmin: false,
          }),
        ).toBe(false);
      });

      it('should work with explicit mode: "any"', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER,
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.EDITOR, // Editor can update
            isSuperAdmin: false,
            mode: 'any',
          }),
        ).toBe(true);
      });
    });

    describe('mode: "all" (AND logic)', () => {
      it('should require both RBAC and ACL to grant permission', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE];

        // Both grant - should allow
        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.ADMIN, // Admin can update
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.EDITOR, // Editor can update
            isSuperAdmin: false,
            mode: 'all',
          }),
        ).toBe(true);
      });

      it('should deny if RBAC denies even though ACL allows', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.ORG, // Org member cannot delete posts
            rbacRole: RbacRole.MEMBER, // Member cannot delete at org level
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.OWNER, // Owner can delete
            isSuperAdmin: false,
            mode: 'all',
          }),
        ).toBe(false);
      });

      it('should deny if ACL denies even though RBAC allows', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.ADMIN, // Admin can delete
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER, // Viewer cannot delete
            isSuperAdmin: false,
            mode: 'all',
          }),
        ).toBe(false);
      });

      it('should deny if both RBAC and ACL deny', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER,
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER,
            isSuperAdmin: false,
            mode: 'all',
          }),
        ).toBe(false);
      });
    });
  });

  describe('Real-world scenarios', () => {
    describe('Post deletion', () => {
      it('should allow post owner to delete regardless of project role', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER,
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.OWNER,
            isSuperAdmin: false,
          }),
        ).toBe(true);
      });

      it('should allow project admin to delete any post', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.ADMIN,
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER,
            isSuperAdmin: false,
          }),
        ).toBe(true);
      });

      it('should allow project member to delete post even as editor', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER, // Project member can delete posts via RBAC
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.EDITOR, // Editor cannot delete via ACL, but RBAC allows it
            isSuperAdmin: false,
          }),
        ).toBe(true); // Should be true because RBAC grants permission (OR logic)
      });

      it('should not allow org member to delete post', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.ORG,
            rbacRole: RbacRole.MEMBER, // Org member cannot delete posts
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.EDITOR, // Editor cannot delete either
            isSuperAdmin: false,
          }),
        ).toBe(false);
      });
    });

    describe('Post update permissions', () => {
      it('should allow project admin to update posts regardless of ACL role', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.ADMIN,
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER, // Even as just a viewer
            isSuperAdmin: false,
          }),
        ).toBe(true);
      });

      it('should allow post owner to update posts', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER,
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.OWNER,
            isSuperAdmin: false,
          }),
        ).toBe(true);
      });

      it('should allow post editor to update posts', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER,
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.EDITOR,
            isSuperAdmin: false,
          }),
        ).toBe(true);
      });

      it('should allow project member to update posts even as viewer', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER, // Project member can update posts via RBAC
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER, // Viewer cannot update via ACL, but RBAC allows it
            isSuperAdmin: false,
          }),
        ).toBe(true); // Should be true because RBAC grants permission (OR logic)
      });

      it('should not allow org member to update posts', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE];

        expect(
          can(permission, {
            rbacResource: RbacResource.ORG,
            rbacRole: RbacRole.MEMBER, // Org member cannot update posts
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER, // Viewer cannot update either
            isSuperAdmin: false,
          }),
        ).toBe(false);
      });
    });

    describe('Post creation permissions', () => {
      it('should allow project admin to create posts', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.CREATE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.ADMIN,
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER,
            isSuperAdmin: false,
          }),
        ).toBe(true);
      });

      it('should allow project member to create posts', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.CREATE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER,
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.VIEWER, // ACL role doesn't matter for creation
            isSuperAdmin: false,
          }),
        ).toBe(true);
      });

      it('should not allow creation with ACL-only permissions', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.CREATE];

        expect(
          can(permission, {
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.OWNER, // Even owners can't create without RBAC context
            isSuperAdmin: false,
          }),
        ).toBe(false);
      });
    });

    describe('Complex permission scenarios (mode: all example)', () => {
      it('should require both RBAC and ACL permissions when mode is "all"', () => {
        // Example: A project member who is also a post editor should be able to update
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.UPDATE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER, // Member can update posts via RBAC
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.EDITOR, // Editor can update posts via ACL
            isSuperAdmin: false,
            mode: 'all',
          }),
        ).toBe(true);
      });

      it('should deny when RBAC allows but ACL denies in "all" mode', () => {
        const permission =
          PERMISSION[AclResource.LOCATION][ResourceAction.DELETE];

        expect(
          can(permission, {
            rbacResource: RbacResource.PROJECT,
            rbacRole: RbacRole.MEMBER, // Member can delete posts via RBAC
            aclResource: AclResource.LOCATION,
            aclRole: AclRole.EDITOR, // But editor cannot delete via ACL
            isSuperAdmin: false,
            mode: 'all',
          }),
        ).toBe(false);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined permissions gracefully', () => {
      const undefinedPermission = 'nonexistent:permission' as TPermissionKey<
        RbacResource,
        ResourceAction | RbacResourceAction
      >;

      expect(
        can(undefinedPermission, {
          rbacResource: RbacResource.PROJECT,
          rbacRole: RbacRole.ADMIN,
          isSuperAdmin: false,
        }),
      ).toBe(false);
    });
  });
});
