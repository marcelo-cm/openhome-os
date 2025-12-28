'use server';

import {
  TCreateProject,
  TProject,
  TUpdateProject,
} from '@openhome-os/core/models/project/project-types';

import ProjectService from './project-service';

// Create
export async function createProject({
  data,
}: {
  data: TCreateProject;
}): Promise<TProject | undefined> {
  try {
    const [project] = await ProjectService.createProject({ project: data });

    return project;
  } catch (error) {
    console.error('[createProject]', error);
    throw new Error('Failed to create Project');
  }
}

// Read (Get All)
export async function getProjects(): Promise<TProject[]> {
  try {
    const projects = await ProjectService.getAllProject();

    return projects;
  } catch (error) {
    console.error('[getProjects]', error);
    throw new Error('Failed to get Projects');
  }
}

// Read (Get)
export async function getProject({ id }: { id: string }): Promise<TProject> {
  try {
    const project = await ProjectService.getProject({ id });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  } catch (error) {
    console.error('[getProject]', error);
    throw new Error('Failed to get Project');
  }
}

// Update
export async function updateProject({
  id,
  data,
}: {
  id: string;
  data: TUpdateProject;
}): Promise<TProject> {
  try {
    const [project] = await ProjectService.updateProject({ id, project: data });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  } catch (error) {
    console.error('[updateProject]', error);
    throw new Error('Failed to update Project');
  }
}

// Delete
export async function deleteProject({ id }: { id: string }): Promise<TProject> {
  try {
    const [project] = await ProjectService.deleteProject({ id });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  } catch (error) {
    console.error('[deleteProject]', error);
    throw new Error('Failed to delete Project');
  }
}
