import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchCommonFaq } from '../../services/kalyaniApi';
import { FALLBACK_FAQS } from '../../data/fallbacks/fallbackFaqs';

export function useCommonFaq() {
  return useQuery({
    queryKey: QUERY_KEYS.commonFaq,
    queryFn: fetchCommonFaq,
    placeholderData: FALLBACK_FAQS,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useCommonFaq;
