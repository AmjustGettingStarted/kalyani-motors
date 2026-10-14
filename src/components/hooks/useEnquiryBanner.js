import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchEnquiryBannerImg } from '../../services/kalyaniApi';

export function useEnquiryBanner() {
  return useQuery({
    queryKey: QUERY_KEYS.enquiryBanner,
    queryFn: fetchEnquiryBannerImg,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useEnquiryBanner;
