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
import { Field, FieldLabel } from '@openhome-os/ui/field';
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
import useUsersQuery from '@/models/user/hooks/use-users';

import {
  addAdminToLocation,
  addMemberToLocation,
} from '@/models/location/location-actions';
import { RbacRole } from '@/permissions/rbac-enums';

interface LocationMembershipCreationDialogProps extends RemoteTriggerProps {
  locationId: string;
  onSuccess?: () => void;
}

const text = {
  title: 'Add Member to Location',
  description: 'Add a user to this location with a specific role.',
  primary: {
    text: 'Add Member',
    loading: 'Adding...',
  },
  secondary: {
    text: 'Cancel',
    loading: 'Cancelling...',
  },
  error: 'Failed to add member',
};

const LocationMembershipCreationDialog = ({
  onSuccess,
  open,
  onOpenChange,
  children,
  locationId,
}: LocationMembershipCreationDialogProps) => {
  const queryClient = useQueryClient();
  const [isOpen, handleOpenChange] = useRemoteTrigger({
    open,
    onOpenChange,
  });
  const { data: users, isLoading } = useUsersQuery({
    enabled: isOpen,
    queryKey: ['system', 'users'],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const userId = formData.get('user_id') as string;
      const role = formData.get('role') as RbacRole;

      if (!userId) {
        throw new Error('Please select a user');
      }

      if (role === RbacRole.ADMIN) {
        await addAdminToLocation({
          locationId,
          userId,
        });
      } else {
        await addMemberToLocation({
          locationId,
          userId,
        });
      }

      // Close the dialog and call success callback
      handleOpenChange(false);

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : text.error);
    } finally {
      setIsSubmitting(false);
      await queryClient.invalidateQueries({
        queryKey: ['location', 'memberships', locationId],
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && children}
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>

        <Form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-3 text-sm">
                {error}
              </div>
            )}

            <Field>
              <FieldLabel>User</FieldLabel>
              <Select name="user_id" required>
                <SelectTrigger disabled={isSubmitting || isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select name="role" defaultValue={RbacRole.MEMBER} required>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value={RbacRole.MEMBER}>Member</SelectItem>
                  <SelectItem value={RbacRole.ADMIN}>Admin</SelectItem>
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
              {text.secondary.text}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? text.primary.loading : text.primary.text}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};

export default LocationMembershipCreationDialog;
