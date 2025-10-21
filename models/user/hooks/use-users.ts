import { useCallback } from 'react';

import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getUsers } from '../user-actions';
import { TUser } from '../user-types';

interface UseUsersProps
  extends Partial<Omit<UseQueryOptions<TUser[]>, 'queryFn'>> {}

const useUsers = ({ queryKey = [], ...props }: UseUsersProps = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery<TUser[], Error>({
    queryKey: ['users', ...queryKey],
    queryFn: () => getUsers(),
    initialData: [],
    ...props,
  });

  const invalidate = useCallback(() => {
    return queryClient.invalidateQueries({
      queryKey: ['users', ...queryKey],
    });
  }, [queryClient, queryKey]);

  return { ...query, invalidate };
};

export default useUsers;
