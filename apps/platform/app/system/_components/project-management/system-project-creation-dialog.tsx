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

import { createProject, updateProject } from '@/models/project/project-actions';
import { TProject } from '@/models/project/project-types';

interface SystemProjectCreationDialogProps extends RemoteTriggerProps {
  onSuccess?: () => void;
  project?: TProject;
}

const text = {
  create: {
    title: 'Create New Project',
    description: 'Add a new project to an organization.',
    primary: {
      text: 'Create Project',
      loading: 'Creating...',
    },
    secondary: {
      text: 'Cancel',
      loading: 'Cancelling...',
    },
    error: 'Failed to create project',
  },
  edit: {
    title: 'Edit Project',
    description: "Edit the project's information.",
    primary: {
      text: 'Update Project',
      loading: 'Updating...',
    },
    secondary: {
      text: 'Cancel',
      loading: 'Cancelling...',
    },
    error: 'Failed to update project',
  },
};

const SystemProjectCreationDialog = ({
  onSuccess,
  open,
  onOpenChange,
  children,
  project,
}: SystemProjectCreationDialogProps) => {
  const mode = project ? 'edit' : 'create';
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

      const name = formData.get('name') as string;
      const organizationId = formData.get('organization_id') as string;

      if (mode === 'create') {
        await createProject({
          data: {
            name,
            organization_id: organizationId,
          },
        });
      } else if (mode === 'edit') {
        if (!project) {
          throw new Error('Project not found');
        }
        await updateProject({
          id: project.id,
          data: {
            name,
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
        queryKey: ['system', 'projects'],
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

            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldControl
                name="name"
                type="text"
                placeholder="My Project"
                required
                disabled={isSubmitting}
                defaultValue={project?.name}
              />
            </Field>

            <Field>
              <FieldLabel>Organization</FieldLabel>
              <Select
                name="organization_id"
                defaultValue={project?.organization_id ?? undefined}
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

export default SystemProjectCreationDialog;
