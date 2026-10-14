import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchBlogPages } from '../../services/kalyaniApi';

export function useBlogPages() {
  return useQuery({
    queryKey: QUERY_KEYS.blogPages,
    queryFn: fetchBlogPages,
    staleTime: 1000 * 60 * 60, // 1 hour
    select: (data) => {
      if (!Array.isArray(data)) return [];
      return data.filter((page) => page && page.title);
    },
  });
}

export default useBlogPages;
