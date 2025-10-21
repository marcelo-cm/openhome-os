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

import {
  createLocation,
  updateLocation,
} from '@/models/location/location-actions';
import { TLocation } from '@/models/location/location-types';

interface SystemLocationCreationDialogProps extends RemoteTriggerProps {
  onSuccess?: () => void;
  location?: TLocation;
}

const text = {
  create: {
    title: 'Create New Location',
    description: 'Add a new location to a project.',
    primary: {
      text: 'Create Location',
      loading: 'Creating...',
    },
    secondary: {
      text: 'Cancel',
      loading: 'Cancelling...',
    },
    error: 'Failed to create location',
  },
  edit: {
    title: 'Edit Location',
    description: "Edit the location's information.",
    primary: {
      text: 'Update Location',
      loading: 'Updating...',
    },
    secondary: {
      text: 'Cancel',
      loading: 'Cancelling...',
    },
    error: 'Failed to update location',
  },
};

const SystemLocationCreationDialog = ({
  onSuccess,
  open,
  onOpenChange,
  children,
  location,
}: SystemLocationCreationDialogProps) => {
  const mode = location ? 'edit' : 'create';
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

      if (mode === 'create') {
        await createLocation({
          data: {
            name,
            project_id: projectId,
          },
        });
      } else if (mode === 'edit') {
        if (!location) {
          throw new Error('Location not found');
        }
        await updateLocation({
          id: location.id,
          data: {
            name,
            project_id: projectId,
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
        queryKey: ['locations'],
        exact: false,
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
                placeholder="Building A"
                defaultValue={location?.name}
                required
                disabled={isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel>Project</FieldLabel>
              <Select name="project_id" defaultValue={location?.project_id}>
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

export default SystemLocationCreationDialog;
