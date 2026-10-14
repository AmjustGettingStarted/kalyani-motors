import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../services/queryKeys';
import { fetchIconLocations } from '../../services/kalyaniApi';

export const DEFAULT_ICON_LOCATIONS = [
  { id: '1', city: 'Bengaluru', cityTitle: 'Bengaluru', phone: '9590990011', address: 'Nayandahalli, Mysore Road, Bengaluru - 560039', email: 'customersupport@kalyanimotors.com' },
  { id: '2', city: 'Hyderabad', cityTitle: 'Hyderabad', phone: '9014600700', address: 'Hyderabad, Telangana', email: 'support.hyd@kalyanimotors.com' },
  { id: '4', city: 'Mysore', cityTitle: 'Mysore', phone: '9590960011', address: 'Mysore, Karnataka', email: 'support.mys@kalyanimotors.com' },
  { id: '5', city: 'Chennai', cityTitle: 'Chennai', phone: '044 - 6171 0649', address: 'Chennai, Tamil Nadu', email: 'support.tn@kalyanimotors.com' },
];

export function useIconLocations() {
  return useQuery({
    queryKey: QUERY_KEYS.iconLocations,
    queryFn: fetchIconLocations,
    staleTime: 1000 * 60 * 60, // 1 hour
    placeholderData: DEFAULT_ICON_LOCATIONS,
    select: (data) => {
      if (!Array.isArray(data)) return [];
      // Deduplicate to one entry per city
      const seen = new Set();
      return data.filter((item) => {
        if (!item || !item.city) return false;
        const key = item.city.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    },
  });
}

export default useIconLocations;
