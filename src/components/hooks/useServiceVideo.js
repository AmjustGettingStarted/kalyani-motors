import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchServiceVideo } from '../../services/kalyaniApi';

export function useServiceVideo() {
  return useQuery({
    queryKey: QUERY_KEYS.serviceVideo,
    queryFn: fetchServiceVideo,
    placeholderData: '',
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useServiceVideo;
