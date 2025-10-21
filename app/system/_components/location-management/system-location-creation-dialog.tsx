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
import useProjects from '@/models/project/hooks/use-projects';

import { createLocation } from '@/models/location/location-actions';

interface SystemLocationCreationDialogProps extends RemoteTriggerProps {
  onSuccess?: () => void;
}

const SystemLocationCreationDialog = ({
  onSuccess,
  open,
  onOpenChange,
  children,
}: SystemLocationCreationDialogProps) => {
  const queryClient = useQueryClient();
  const [isOpen, handleOpenChange] = useRemoteTrigger({
    open,
    onOpenChange,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: projects, isLoading: isProjectsLoading } = useProjects({
    enabled: isOpen,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const name = formData.get('name') as string;
      const projectId = formData.get('project_id') as string;

      await createLocation({
        data: {
          name,
          project_id: projectId,
        },
      });

      // Close the dialog and call success callback
      handleOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: ['locations'],
      });
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create location',
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
          <DialogTitle>Create New Location</DialogTitle>
          <DialogDescription>
            Add a new location to a project.
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
                placeholder="Building A"
                required
                disabled={isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel>Project</FieldLabel>
              <Select name="project_id" defaultValue={undefined}>
                <SelectTrigger disabled={isSubmitting || isProjectsLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
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
              {isSubmitting ? 'Creating...' : 'Create Location'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};

export default SystemLocationCreationDialog;
