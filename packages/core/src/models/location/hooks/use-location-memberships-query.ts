import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getLocationMemberships } from '../location-actions';
import { TLocationMembershipHydrated } from '../location-types';

interface UseLocationMembershipsQueryProps
  extends Omit<UseQueryOptions<TLocationMembershipHydrated[]>, 'queryFn'> {
  locationId: string;
}

const useLocationMembershipsQuery = (
  props: UseLocationMembershipsQueryProps,
) => {
  const { locationId, ...queryOptions } = props;

  return useQuery<TLocationMembershipHydrated[], Error>({
    queryFn: () => getLocationMemberships({ locationId }),
    initialData: [],
    enabled: !!locationId,
    ...queryOptions,
  });
};

export default useLocationMembershipsQuery;
