import { useCallback } from 'react';

import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getProjects } from '../project-actions';
import { TProject } from '../project-types';

interface UseProjectsProps
  extends Partial<Omit<UseQueryOptions<TProject[]>, 'queryFn'>> {}

const useProjects = ({ queryKey = [], ...props }: UseProjectsProps = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery<TProject[], Error>({
    queryKey: ['projects', ...queryKey],
    queryFn: () => getProjects(),
    initialData: [],
    ...props,
  });

  const invalidate = useCallback(() => {
    return queryClient.invalidateQueries({
      queryKey: ['projects', ...queryKey],
    });
  }, [queryClient, queryKey]);

  return { ...query, invalidate };
};

export default useProjects;
