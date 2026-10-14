import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchAllModelList } from '../../services/kalyaniApi';

export function useAllModelList() {
  return useQuery({
    queryKey: QUERY_KEYS.allModelList,
    queryFn: fetchAllModelList,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useAllModelList;
