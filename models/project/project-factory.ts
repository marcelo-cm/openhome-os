import { faker } from '@faker-js/faker';

import { RbacRole } from '@/permissions/rbac-enums';

import buildFakeBase from '../base/base-factory';
import { TBaseModel, TWithoutBaseModel } from '../base/base-types';
import { buildMany } from '../base/base-utils';
import { TProject, TProjectMembership } from './project-types';

export function buildFakeProject(
  options: {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TProject>>;
  } = {},
): TProject {
  const { baseOverride, override } = options;
  const base = buildFakeBase(baseOverride);
  const project: TProject = {
    ...base,
    name: faker.lorem.words(),
    organization_id: faker.string.uuid(),
  };

  return {
    ...project,
    ...override,
  };
}

export function buildFakeProjects(
  count = 1,
  optionsFactory?: (index: number) => {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TProject>>;
  },
): TProject[] {
  return buildMany((index) => buildFakeProject(optionsFactory?.(index)), count);
}

export function buildFakeProjectMembership(
  options: {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TProjectMembership>>;
  } = {},
): TProjectMembership {
  const { baseOverride, override } = options;
  const base = buildFakeBase(baseOverride);
  const project: TProjectMembership = {
    ...base,
    user_id: faker.string.uuid(),
    project_id: faker.string.uuid(),
    rbac_role: faker.helpers.enumValue(RbacRole),
  };

  return {
    ...project,
    ...override,
  };
}

export function buildFakeProjectMemberships(
  count = 1,
  optionsFactory?: (index: number) => {
    baseOverride?: Partial<TBaseModel>;
    override?: Partial<TWithoutBaseModel<TProjectMembership>>;
  },
): TProjectMembership[] {
  return buildMany(
    (index) => buildFakeProjectMembership(optionsFactory?.(index)),
    count,
  );
}

export default buildFakeProject;
