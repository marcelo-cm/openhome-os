import { useCallback } from 'react';

import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getOrganizations } from '../organization-actions';
import { TOrganization } from '../organization-types';

interface UseOrganizationsProps
  extends Partial<Omit<UseQueryOptions<TOrganization[]>, 'queryFn'>> {}

const useOrganizations = ({
  queryKey = [],
  ...props
}: UseOrganizationsProps = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery<TOrganization[], Error>({
    queryKey: ['organizations', ...queryKey],
    queryFn: () => getOrganizations(),
    initialData: [],
    ...props,
  });

  const invalidate = useCallback(() => {
    return queryClient.invalidateQueries({
      queryKey: ['organizations', ...queryKey],
    });
  }, [queryClient, queryKey]);

  return { ...query, invalidate };
};

export default useOrganizations;
