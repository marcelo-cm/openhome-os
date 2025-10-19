'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldControl, FieldLabel } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  RemoteTriggerProps,
  useRemoteTrigger,
} from '@/hooks/use-remote-trigger';

import { createUser } from '@/models/user/user-actions';
import { UserRole } from '@/models/user/user-enums';

interface SystemUserCreationDialogProps extends RemoteTriggerProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const SystemUserCreationDialog = ({
  onSuccess,
  open,
  onOpenChange,
  children,
}: SystemUserCreationDialogProps) => {
  const [isOpen, handleOpenChange] = useRemoteTrigger({
    open,
    onOpenChange,
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

      await createUser({
        data: {
          first_name: firstName,
          last_name: lastName || undefined,
          email,
          password,
          role,
          organization_id: undefined,
        },
      });

      // Close the dialog and call success callback
      handleOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && children}
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will receive an email with their
            login credentials.
          </DialogDescription>
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
                />
              </Field>

              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <FieldControl
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  disabled={isSubmitting}
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
              />
            </Field>

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

            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select name="role" defaultValue={UserRole.USER}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value={UserRole.USER}>User</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
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
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};

export default SystemUserCreationDialog;
