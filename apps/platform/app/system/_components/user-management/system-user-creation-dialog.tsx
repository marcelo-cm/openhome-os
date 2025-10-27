'use client';

import { useState } from 'react';

import { Button } from '@openhome-os/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from '@openhome-os/ui/dialog';
import { Field, FieldControl, FieldLabel } from '@openhome-os/ui/field';
import { Form } from '@openhome-os/ui/form';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@openhome-os/ui/select';
import { useQueryClient } from '@tanstack/react-query';

import {
  RemoteTriggerProps,
  useRemoteTrigger,
} from '@/hooks/use-remote-trigger';
import useOrganizationsQuery from '@/models/organization/hooks/use-organizations-query';

import { createUser, updateUser } from '@/models/user/user-actions';
import { UserRole } from '@/models/user/user-enums';
import { TUser } from '@/models/user/user-types';

interface SystemUserCreationDialogProps extends RemoteTriggerProps {
  onSuccess?: () => void;
  user?: TUser;
}

const text = {
  create: {
    title: 'Create New User',
    description:
      'Add a new user to the system. They will receive an email with their login credentials.',
    primary: {
      text: 'Create User',
      loading: 'Creating...',
    },
    secondary: {
      text: 'Cancel',
      loading: 'Cancelling...',
    },
    error: 'Failed to create user',
  },
  edit: {
    title: 'Edit User',
    description: "Edit the user's information.",
    primary: {
      text: 'Update User',
      loading: 'Updating...',
    },
    secondary: {
      text: 'Cancel',
      loading: 'Cancelling...',
    },
    error: 'Failed to update user',
  },
};

const SystemUserCreationDialog = ({
  onSuccess,
  open,
  onOpenChange,
  children,
  user,
}: SystemUserCreationDialogProps) => {
  const mode = user ? 'edit' : 'create';
  const queryClient = useQueryClient();
  const [isOpen, handleOpenChange] = useRemoteTrigger({
    open,
    onOpenChange,
  });
  const { data: organizations, isLoading } = useOrganizationsQuery({
    enabled: isOpen,
    queryKey: ['system', 'organizations'],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const firstName = formData.get('first_name') as string;
      const lastName = formData.get('last_name') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const role = formData.get('role') as UserRole;
      const organizationId = formData.get('organization_id') as
        | string
        | undefined;

      if (mode === 'create') {
        await createUser({
          data: {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            role,
            organization_id: organizationId,
          },
        });
      } else if (mode === 'edit') {
        if (!user) {
          throw new Error('User not found');
        }
        await updateUser({
          id: user.id,
          data: {
            first_name: firstName,
            last_name: lastName,
            role,
            organization_id: organizationId,
          },
        });
      } else {
        throw new Error('Invalid mode');
      }

      // Close the dialog and call success callback
      handleOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : text[mode].error);
    } finally {
      setIsSubmitting(false);
      await queryClient.invalidateQueries({
        queryKey: ['system', 'users'],
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && children}
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>{text[mode].title}</DialogTitle>
          <DialogDescription>{text[mode].description}</DialogDescription>
        </DialogHeader>

        <Form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <FieldControl
                  name="first_name"
                  type="text"
                  placeholder="John"
                  required
                  disabled={isSubmitting}
                  defaultValue={user?.first_name}
                />
              </Field>

              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <FieldControl
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  disabled={isSubmitting}
                  defaultValue={user?.last_name ?? undefined}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldControl
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                required
                disabled={isSubmitting}
                defaultValue={user?.email}
              />
            </Field>

            {mode === 'create' && (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldControl
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  disabled={isSubmitting}
                />
              </Field>
            )}

            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select name="role" defaultValue={user?.role ?? UserRole.USER}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value={UserRole.USER}>User</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                </SelectPopup>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Organization</FieldLabel>
              <Select
                name="organization_id"
                defaultValue={user?.organization_id ?? undefined}
              >
                <SelectTrigger disabled={isSubmitting || isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {organizations?.map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              {text[mode].secondary.text}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? text[mode].primary.loading
                : text[mode].primary.text}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};

export default SystemUserCreationDialog;
