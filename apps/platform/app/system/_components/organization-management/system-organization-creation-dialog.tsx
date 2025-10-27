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

import {
  createOrganization,
  updateOrganization,
} from '@/models/organization/organization-actions';
import { OrganizationTier } from '@/models/organization/organization-enums';
import { TOrganization } from '@/models/organization/organization-types';

interface SystemOrganizationCreationDialogProps extends RemoteTriggerProps {
  onSuccess?: () => void;
  organization?: TOrganization;
}

const text = {
  create: {
    title: 'Create New Organization',
    description: 'Add a new organization to the system.',
    primary: {
      text: 'Create Organization',
      loading: 'Creating...',
    },
    secondary: {
      text: 'Cancel',
      loading: 'Cancelling...',
    },
    error: 'Failed to create organization',
  },
  edit: {
    title: 'Edit Organization',
    description: "Edit the organization's information.",
    primary: {
      text: 'Update Organization',
      loading: 'Updating...',
    },
    secondary: {
      text: 'Cancel',
      loading: 'Cancelling...',
    },
    error: 'Failed to update organization',
  },
};

const SystemOrganizationCreationDialog = ({
  onSuccess,
  open,
  onOpenChange,
  children,
  organization,
}: SystemOrganizationCreationDialogProps) => {
  const mode = organization ? 'edit' : 'create';
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

      if (mode === 'create') {
        await createOrganization({
          data: {
            name,
            logo_url: logoUrl || undefined,
            tier,
          },
        });
      } else if (mode === 'edit') {
        if (!organization) {
          throw new Error('Organization not found');
        }
        await updateOrganization({
          id: organization.id,
          data: {
            name,
            logo_url: logoUrl || undefined,
            tier,
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
      await queryClient.invalidateQueries({
        queryKey: ['system', 'organizations'],
      });
      setIsSubmitting(false);
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

            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldControl
                name="name"
                type="text"
                placeholder="Acme Corp"
                defaultValue={organization?.name}
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
                defaultValue={organization?.logo_url ?? undefined}
                disabled={isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel>Tier</FieldLabel>
              <Select
                name="tier"
                defaultValue={organization?.tier ?? OrganizationTier.FREE}
              >
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

export default SystemOrganizationCreationDialog;
