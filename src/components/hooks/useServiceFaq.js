import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchServiceFaq } from '../../services/kalyaniApi';
import { FALLBACK_FAQS } from '../../data/fallbacks/fallbackFaqs';

export function useServiceFaq() {
  return useQuery({
    queryKey: QUERY_KEYS.serviceFaq,
    queryFn: fetchServiceFaq,
    placeholderData: FALLBACK_FAQS,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useServiceFaq;
