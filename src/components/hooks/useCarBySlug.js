import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchCarBySlug } from '../../services/kalyaniApi';
import { mockCars } from '../../data/mockCars';

export function useCarBySlug(slug) {
  const fallbackCar = mockCars.find(
    (c) => c.slug?.toLowerCase() === slug?.toLowerCase()
  );

  return useQuery({
    queryKey: QUERY_KEYS.carBySlug(slug),
    queryFn: () => fetchCarBySlug(slug),
    enabled: Boolean(slug),
    placeholderData: fallbackCar ? [fallbackCar, ...(fallbackCar.variants || [])] : undefined,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export default useCarBySlug;
