import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchAllModels } from '../../services/kalyaniApi';
import { mockCars } from '../../data/fallbacks/fallbackCars';

export function useModels() {
  return useQuery({
    queryKey: QUERY_KEYS.models,
    queryFn: fetchAllModels,
    placeholderData: mockCars,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useModels;
