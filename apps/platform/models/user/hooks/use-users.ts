import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getUsers } from '../user-actions';
import { TUser } from '../user-types';

interface UseUsersQueryProps
  extends Omit<UseQueryOptions<TUser[]>, 'queryFn'> {}

const useUsersQuery = (props: UseUsersQueryProps) => {
  return useQuery<TUser[], Error>({
    queryFn: () => getUsers(),
    initialData: [],
    ...props,
  });
};

export default useUsersQuery;
