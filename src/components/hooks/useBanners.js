import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchBanners } from '../../services/kalyaniApi';
import { mockBanners } from '../../data/fallbacks/fallbackBanners';

const FALLBACK_BANNER_MAP = {
  Bengaluru: mockBanners,
  Hyderabad: mockBanners,
  Mysore: mockBanners,
  Chennai: mockBanners,
};

export function useBanners(customIsMobile) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof customIsMobile === 'boolean') return customIsMobile;
    if (typeof window !== 'undefined') return window.innerWidth <= 576;
    return false;
  });

  useEffect(() => {
    if (typeof customIsMobile === 'boolean') {
      setIsMobile(customIsMobile);
      return;
    }
    const check = () => setIsMobile(window.innerWidth <= 576);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [customIsMobile]);

  return useQuery({
    queryKey: QUERY_KEYS.banners(isMobile),
    queryFn: () => fetchBanners(isMobile),
    placeholderData: FALLBACK_BANNER_MAP,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useBanners;
