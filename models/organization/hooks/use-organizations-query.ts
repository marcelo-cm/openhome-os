import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getOrganizations } from '../organization-actions';
import { TOrganization } from '../organization-types';

interface UseOrganizationsQueryProps
  extends Omit<UseQueryOptions<TOrganization[]>, 'queryFn'> {}

const useOrganizationsQuery = (props: UseOrganizationsQueryProps) => {
  return useQuery<TOrganization[], Error>({
    queryFn: () => getOrganizations(),
    initialData: [],
    ...props,
  });
};

export default useOrganizationsQuery;
