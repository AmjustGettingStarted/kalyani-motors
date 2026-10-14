import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchOutlets } from '../../services/kalyaniApi';
import { FALLBACK_LOCATIONS } from '../../data/fallbacks/fallbackLocations';

export function useOutlets() {
  return useQuery({
    queryKey: QUERY_KEYS.outlets,
    queryFn: fetchOutlets,
    placeholderData: FALLBACK_LOCATIONS,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useOutlets;
