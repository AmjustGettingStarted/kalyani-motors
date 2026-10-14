import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchPolicyBannerImg } from '../../services/kalyaniApi';

export function usePolicyBanner() {
  return useQuery({
    queryKey: QUERY_KEYS.policyBanner,
    queryFn: fetchPolicyBannerImg,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default usePolicyBanner;
