import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchServices } from '../../services/kalyaniApi';
import { mockServices } from '../../data/fallbacks/fallbackServices';

export function useServices() {
  return useQuery({
    queryKey: QUERY_KEYS.services,
    queryFn: fetchServices,
    placeholderData: mockServices.serviceCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useServices;
