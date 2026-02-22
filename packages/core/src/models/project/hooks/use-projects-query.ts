import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getProjects } from '../project-actions';
import { TProject } from '../project-types';

type UseProjectsQueryProps = Omit<UseQueryOptions<TProject[]>, 'queryFn'>;

const useProjectsQuery = (props: UseProjectsQueryProps) => {
  return useQuery<TProject[], Error>({
    queryFn: () => getProjects(),
    initialData: [],
    ...props,
  });
};

export default useProjectsQuery;
