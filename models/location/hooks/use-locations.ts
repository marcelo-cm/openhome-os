import { useCallback } from 'react';

import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getLocations } from '../location-actions';
import { TLocation } from '../location-types';

interface UseLocationsProps
  extends Partial<Omit<UseQueryOptions<TLocation[]>, 'queryFn'>> {}

const useLocations = ({ queryKey = [], ...props }: UseLocationsProps = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery<TLocation[], Error>({
    queryKey: ['locations', ...queryKey],
    queryFn: () => getLocations(),
    initialData: [],
    ...props,
  });

  const invalidate = useCallback(() => {
    return queryClient.invalidateQueries({
      queryKey: ['locations', ...queryKey],
    });
  }, [queryClient, queryKey]);

  return { ...query, invalidate };
};

export default useLocations;
