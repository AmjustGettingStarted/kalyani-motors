import { STORAGE_CDN, ADMIN_ROOT } from './api.js';

// ─── CDN Asset Helpers ────────────────────────────────────────────────────────

/** Prepend storage CDN to any relative image path returned by the API */
export function getStorageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${STORAGE_CDN}${cleanPath}`;
}

/** For brochures/PDFs (admin root, NOT /storage/) */
export function getFileUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${ADMIN_ROOT}${cleanPath}`;
}

// ─── City Normalization ───────────────────────────────────────────────────────

/** Maps numeric city IDs from /api/iconlocation to canonical strings */
export const NUMERIC_CITY_MAP = {
  0: 'Hyderabad',
  1: 'Bengaluru',
  2: 'Mysore',
  3: 'Chennai',
};

/** Maps lowercase city strings from /api/location & /api/banner to canonical */
export const CITY_STRING_MAP = {
  bengaluru: 'Bengaluru',
  bangalore: 'Bengaluru',
  hyderabad: 'Hyderabad',
  hydrabad: 'Hyderabad', // legacy typo from API
  mysore: 'Mysore',
  chennai: 'Chennai',
};

export function normalizeCity(rawCity) {
  if (typeof rawCity === 'number') return NUMERIC_CITY_MAP[rawCity] ?? 'Bengaluru';
  if (typeof rawCity === 'string') {
    const trimmed = rawCity.trim().toLowerCase();
    return CITY_STRING_MAP[trimmed] ?? rawCity;
  }
  return 'Bengaluru';
}

// ─── Slug to API Name Lookup Table ────────────────────────────────────────────

export const SLUG_TO_API_NAME = {
  'alto': 'Maruti Suzuki Alto',
  'alto-k10': 'Maruti Suzuki Alto K10',
  'celerio': 'Maruti Suzuki Celerio',
  'swift': 'Maruti Suzuki Swift',
  'wagon-r': 'Maruti Suzuki WagonR',
  'dzire': 'Maruti Suzuki Dzire',
  'ertiga': 'Maruti Suzuki Ertiga',
  'brezza': 'Maruti Suzuki Brezza 2022',
  'eeco': 'Maruti Suzuki Eeco',
  's-presso': 'Maruti Suzuki S-Presso',
  'fronx': 'Maruti Suzuki Fronx',
  'baleno': 'Maruti Suzuki Baleno',
  'ignis': 'Maruti Suzuki Ignis',
  'ciaz': 'Maruti Suzuki Ciaz',
  'xl6': 'Maruti Suzuki XL6',
  'grand-vitara': 'Maruti Suzuki Grand Vitara',
  'jimny': 'Maruti Suzuki Jimny',
  'invicto': 'Maruti Suzuki Invicto',
  'super-carry': 'Maruti Suzuki Super Carry',
  'eeco-cargo': 'Maruti Suzuki Eeco Cargo',
  'tour-h1': 'Maruti Suzuki Tour H1',
  'tour-h3': 'Maruti Suzuki Tour H3',
  'tour-s': 'Maruti Suzuki Tour S',
  'tour-v': 'Maruti Suzuki Tour V',
  'tour-m': 'Maruti Suzuki Tour M',
};

export function slugToApiName(slug) {
  return SLUG_TO_API_NAME[slug?.toLowerCase()] ?? slug?.replace(/-/g, ' ');
}

export function apiNameToSlug(name) {
  if (!name) return '';
  const match = Object.entries(SLUG_TO_API_NAME).find(
    ([, v]) => v.toLowerCase() === name.toLowerCase()
  );
  if (match) return match[0];
  return name.toLowerCase().replace(/^maruti suzuki\s+/i, '').replace(/\s+/g, '-');
}

// ─── Slash-Delimited Spec Splitter ────────────────────────────────────────────

export function splitSlashSpec(raw) {
  if (!raw) return [];
  return [...new Set(raw.split('/').map((s) => s.trim()).filter(Boolean))];
}

// ─── Longitude Typo Fix & GPS Helpers ─────────────────────────────────────────

export function normalizeGps(rawOutlet) {
  if (!rawOutlet) return { latitude: null, longitude: null };
  return {
    latitude: parseFloat(rawOutlet.latitude) || null,
    longitude: parseFloat(rawOutlet.longtitude ?? rawOutlet.longitude) || null,
  };
}

export function buildMapsUrl(rawOutlet) {
  const { latitude, longitude } = normalizeGps(rawOutlet);
  if (!latitude || !longitude) return null;
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

// ─── Outlet Type Map ──────────────────────────────────────────────────────────

export const OUTLET_TYPE_MAP = {
  'Showroom': 'Sales',
  'Sales': 'Sales',
  'Workshop': 'Service',
  'Service': 'Service',
  'True Value': 'True Value',
  'Driving School': 'Driving School',
  'Service On Wheel': 'Service',
  'Nexa Service (Kalyani Motors)': 'Service',
};

// ─── Entity Normalizers ───────────────────────────────────────────────────────

export function normalizeOutlet(raw) {
  if (!raw) return null;
  let category = raw.category?.title ? raw.category.title.toLowerCase().replace(/\s+/g, '-') : '';
  const typeMapped = OUTLET_TYPE_MAP[raw.type] ?? raw.type ?? 'Sales';

  if (raw.type === 'Driving School') {
    category = 'driving-school';
  } else if (raw.type === 'True Value' || category === 'truevalue' || category === 'true-value') {
    category = 'truevalue';
  }

  return {
    id: String(raw.id),
    name: raw.location_name || raw.title || '',
    type: typeMapped,
    category,
    address: raw.address || '',
    city: normalizeCity(raw.city),
    phone: raw.phone || raw.phone_number || '',
    email: raw.email || '',
    hours: raw.open_time && raw.close_time ? `${raw.open_time} - ${raw.close_time}` : (raw.hours || '09:00 AM - 06:00 PM'),
    mapUrl: raw.map_link || buildMapsUrl(raw),
    gps: normalizeGps(raw),
    image: getStorageUrl(raw.image),
  };
}

export function normalizeIconLocation(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id),
    city: normalizeCity(raw.city),
    cityTitle: raw.title || '',
    phone: raw.phone_number || '',
    address: raw.address || '',
    email: raw.email || '',
    icon: getStorageUrl(raw.loc_image || raw.icon),
  };
}

export function normalizeBanner(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id),
    title: raw.title || '',
    subtitle: '',
    description: '',
    image: getStorageUrl(raw.banner_img),
    slug: raw.link ? raw.link.replace(/^\/cars\/?/, '').replace(/^\//, '') : '',
    channel: '',
    priceText: '',
    badge: '',
    ctaText: 'Explore Model',
    ctaLink: raw.link || '/cars',
    offer: '',
    city: normalizeCity(raw.city),
  };
}

export function normalizeModel(raw) {
  if (!raw) return null;
  const position = typeof raw.position === 'number' ? raw.position : parseInt(raw.position, 10) || 999;
  return {
    id: String(raw.id),
    name: raw.title || '',
    slug: apiNameToSlug(raw.title),
    image: getStorageUrl(raw.image),
    categoryId: raw.category_id,
    position,
    isFeatured: position <= 8,
  };
}

export function normalizeModelCars(rawArray) {
  if (!Array.isArray(rawArray)) return [];
  return rawArray
    .map((item) => {
      const fuels = splitSlashSpec(item.fuel);
      const transmissions = splitSlashSpec(item.transmission);
      const bodyTypes = splitSlashSpec(item.body);
      const position = item.model?.position ?? 999;
      return {
        id: String(item.id),
        name: item.name || '',
        slug: apiNameToSlug(item.name),
        channel: item.model?.category_id === 2 ? 'Nexa' : item.model?.category_id === 3 ? 'Commercial' : 'Arena',
        bodyType: bodyTypes[0] || 'Hatchback',
        bodyTypes,
        fuelTypes: fuels,
        transmissionTypes: transmissions,
        startingPrice: null,
        heroImage: getStorageUrl(item.images?.[0]?.images || item.image),
        images: (item.images ?? []).map((img) => getStorageUrl(img.images)),
        isFeatured: position <= 8,
        tagline: '',
        priceRange: '',
        mileage: '',
        engine: '',
        seatingCapacity: 5,
        bootSpace: '',
        cardSpecs: [
          { label: 'Transmission', value: transmissions[0] || 'Manual' },
          { label: 'Fuel', value: fuels[0] || 'Petrol' },
          { label: 'Body', value: bodyTypes[0] || 'Hatchback' },
        ],
        rating: 4.5,
        reviewsCount: 0,
        position,
      };
    })
    .sort((a, b) => a.position - b.position);
}

export function normalizeCarVariant(raw) {
  if (!raw) return null;
  const fuels = splitSlashSpec(raw.fuel);
  const transmissions = splitSlashSpec(raw.transmission);
  const bodyTypes = splitSlashSpec(raw.body);
  const price = raw.varient?.price ? parseFloat(raw.varient.price) : (raw.price ? parseFloat(raw.price) : null);
  return {
    id: String(raw.id),
    name: raw.name || '',
    slug: apiNameToSlug(raw.name),
    bodyType: bodyTypes[0] || raw.body || '',
    fuelTypes: fuels,
    transmissionTypes: transmissions,
    startingPrice: price,
    engine: raw.engine || '',
    mileage: raw.mileage || '',
    seatingCapacity: parseInt(raw.seating_capacity, 10) || 5,
    bootSpace: raw.boot_space || '',
    heroImage: getStorageUrl(raw.images?.[0]?.images),
    images: (raw.images ?? []).map((img) => getStorageUrl(img.images)),
    variant: raw.varient
      ? {
          id: String(raw.varient.id),
          name: raw.varient.var_title,
          price: parseFloat(raw.varient.price) || null,
          exShowroomPrice: parseFloat(raw.varient.ex_showroom_price) || null,
          fuel: raw.fuel,
          transmission: raw.transmission,
        }
      : null,
    brochureUrl: raw.brochure ? getFileUrl(raw.brochure) : null,
    colors: (raw.colors ?? []).map((c) => ({
      hex: c.color_code,
      name: c.color_name,
      image: getStorageUrl(c.image),
    })),
  };
}

export function normalizeService(raw, index = 0) {
  if (!raw) return null;
  return {
    id: String(raw.id),
    number: String(index + 1).padStart(2, '0'),
    title: raw.title || '',
    shortTitle: raw.title?.split(/[\s&]/)[0] ?? '',
    subtitle: '',
    description: raw.description || '',
    image: getStorageUrl(raw.image),
    slug: raw.title?.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-'),
    points: raw.points ?? [],
    price: raw.price ?? null,
  };
}

export function normalizeCommonFaq(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id),
    title: raw.question || '',
    content: raw.answer || '',
    question: raw.question || '',
    answer: raw.answer || '',
    subtitle: '',
    icon: null,
  };
}

export function partitionByCity(items, getCityFn) {
  if (!Array.isArray(items)) return {};
  return items.reduce((acc, item) => {
    const city = getCityFn(item);
    if (!city) return acc;
    if (!acc[city]) acc[city] = [];
    acc[city].push(item);
    return acc;
  }, {});
}
