import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getLocations } from '../location-actions';
import { TLocation } from '../location-types';

interface UseLocationsQueryProps
  extends Omit<UseQueryOptions<TLocation[]>, 'queryFn'> {}

const useLocationsQuery = (props: UseLocationsQueryProps) => {
  return useQuery<TLocation[], Error>({
    queryFn: () => getLocations(),
    initialData: [],
    ...props,
  });
};

export default useLocationsQuery;
