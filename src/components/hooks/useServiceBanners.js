import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchServiceBanners } from '../../services/kalyaniApi';
import { mockServices } from '../../data/fallbacks/fallbackServices';

const FALLBACK_BANNERS = {
  Bengaluru: mockServices.heroImages,
  Hyderabad: mockServices.heroImages,
  Mysore: mockServices.heroImages,
  Chennai: mockServices.heroImages,
};

export function useServiceBanners() {
  return useQuery({
    queryKey: QUERY_KEYS.serviceBanners,
    queryFn: fetchServiceBanners,
    placeholderData: FALLBACK_BANNERS,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export default useServiceBanners;
