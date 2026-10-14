import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchModelCars } from '../../services/kalyaniApi';

export function useModelCars() {
  return useQuery({
    queryKey: QUERY_KEYS.modelCars,
    queryFn: fetchModelCars,
    placeholderData: [],
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useModelCars;
