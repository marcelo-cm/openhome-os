'use server';

import {
  TCreateProject,
  TProject,
  TUpdateProject,
} from '@/models/project/project-types';

import ProjectService from './project-service';

// Create
export async function createProject(data: TCreateProject): Promise<TProject> {
  try {
    const [project] = await ProjectService.createProject(data);

    return project;
  } catch (error) {
    console.error('[createProject]', error);
    throw new Error('Failed to create Project');
  }
}

// Read (Get)
export async function getProject(id: string): Promise<TProject> {
  try {
    const project = await ProjectService.getProject(id);

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
export async function updateProject(
  id: string,
  data: TUpdateProject,
): Promise<TProject> {
  try {
    const [project] = await ProjectService.updateProject(id, data);

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
export async function deleteProject(id: string): Promise<TProject> {
  try {
    const [project] = await ProjectService.deleteProject(id);

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  } catch (error) {
    console.error('[deleteProject]', error);
    throw new Error('Failed to delete Project');
  }
}
