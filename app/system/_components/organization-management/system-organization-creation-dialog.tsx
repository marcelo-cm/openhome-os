'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

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

import { createOrganization } from '@/models/organization/organization-actions';
import { OrganizationTier } from '@/models/organization/organization-enums';

interface SystemOrganizationCreationDialogProps extends RemoteTriggerProps {
  onSuccess?: () => void;
}

const SystemOrganizationCreationDialog = ({
  onSuccess,
  open,
  onOpenChange,
  children,
}: SystemOrganizationCreationDialogProps) => {
  const queryClient = useQueryClient();
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

      const name = formData.get('name') as string;
      const logoUrl = formData.get('logo_url') as string;
      const tier = formData.get('tier') as OrganizationTier;

      await createOrganization({
        data: {
          name,
          logo_url: logoUrl || undefined,
          tier,
        },
      });

      // Close the dialog and call success callback
      handleOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: ['organizations'],
      });
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create organization',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && children}
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Add a new organization to the system.
          </DialogDescription>
        </DialogHeader>

        <Form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-3 text-sm">
                {error}
              </div>
            )}

            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldControl
                name="name"
                type="text"
                placeholder="Acme Corp"
                required
                disabled={isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel>Logo URL</FieldLabel>
              <FieldControl
                name="logo_url"
                type="url"
                placeholder="https://example.com/logo.png"
                disabled={isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel>Tier</FieldLabel>
              <Select name="tier" defaultValue={OrganizationTier.FREE}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value={OrganizationTier.FREE}>Free</SelectItem>
                  <SelectItem value={OrganizationTier.PRO}>Pro</SelectItem>
                  <SelectItem value={OrganizationTier.ENTERPRISE}>
                    Enterprise
                  </SelectItem>
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
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};

export default SystemOrganizationCreationDialog;
