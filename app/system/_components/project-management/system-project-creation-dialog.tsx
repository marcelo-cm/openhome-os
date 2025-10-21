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
import useOrganizations from '@/models/organization/hooks/use-organizations';

import { createProject } from '@/models/project/project-actions';
import { TProject } from '@/models/project/project-types';

interface SystemProjectCreationDialogProps extends RemoteTriggerProps {
  onSuccess?: () => void;
  project?: TProject;
}

const SystemProjectCreationDialog = ({
  onSuccess,
  open,
  onOpenChange,
  children,
  project,
}: SystemProjectCreationDialogProps) => {
  const queryClient = useQueryClient();
  const [isOpen, handleOpenChange] = useRemoteTrigger({
    open,
    onOpenChange,
  });
  const { data: organizations, isLoading } = useOrganizations({
    enabled: isOpen,
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

      await createProject({
        data: {
          name,
          organization_id: organizationId,
        },
      });

      // Close the dialog and call success callback
      handleOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && children}
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to an organization.
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
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};

export default SystemProjectCreationDialog;
