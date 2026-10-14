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
  'swift': 'New Epic Swift 2024',
  'new-epic-swift-2024': 'New Epic Swift 2024',
  'wagon-r': 'Maruti Suzuki Wagon R',
  'dzire': 'Maruti Suzuki Dzire 2024',
  'dzire-2024': 'Maruti Suzuki Dzire 2024',
  'ertiga': 'Maruti Suzuki Ertiga',
  'brezza': 'Maruti Suzuki Brezza 2022',
  'eeco': 'Maruti Suzuki Eeco',
  's-presso': 'Maruti Suzuki Spresso',
  'spresso': 'Maruti Suzuki Spresso',
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

export function normalizeModel(raw, modelCarsMap = {}, catMap = {}) {
  if (!raw) return null;
  const mc = modelCarsMap[raw.id] || modelCarsMap[String(raw.id)];
  const position = typeof raw.position === 'number' ? raw.position : parseInt(raw.position, 10) || 999;
  const fuels = splitSlashSpec(mc?.fuel || 'Petrol');
  const transmissions = splitSlashSpec(mc?.transmission || 'Manual');
  const bodyTypes = splitSlashSpec(mc?.body || 'Hatchback');
  const channel = catMap[raw.category_id] || (raw.category_id === 1 ? 'Nexa' : raw.category_id === 3 ? 'Commercial' : 'Arena');
  const price = mc?.price ? parseFloat(mc.price) : (raw.starting_price ? parseFloat(raw.starting_price) : null);
  const slug = apiNameToSlug(raw.title);

  return {
    id: String(raw.id),
    name: raw.title || '',
    slug,
    channel,
    bodyType: bodyTypes[0] || 'Hatchback',
    bodyTypes,
    fuelTypes: fuels,
    transmissionTypes: transmissions,
    startingPrice: price || 500000,
    priceRange: price ? `From ₹ ${(price / 100000).toFixed(2)} Lakh*` : 'Contact for Price',
    heroImage: getStorageUrl(raw.image || mc?.image || mc?.images?.[0]?.images),
    image: getStorageUrl(raw.image),
    images: (mc?.images ?? []).map((img) => getStorageUrl(img.images)),
    categoryId: raw.category_id,
    position,
    isFeatured: position <= 8,
    tagline: raw.seo_desc || raw.description || '',
    mileage: '25.2 km/l*',
    engine: '1.2L K-Series',
    seatingCapacity: 5,
    bootSpace: '378 Litres',
    cardSpecs: [
      { label: 'Transmission', value: transmissions[0] || 'Manual' },
      { label: 'Fuel', value: fuels[0] || 'Petrol' },
      { label: 'Body', value: bodyTypes[0] || 'Hatchback' },
    ],
    rating: 4.5,
    reviewsCount: 0,
    description: raw.description || '',
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
        channel: item.model?.category_id === 1 || item.category_id === 1 ? 'Nexa' : item.model?.category_id === 3 || item.category_id === 3 ? 'Commercial' : 'Arena',
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

export function normalizeCarDetails(model, slug) {
  if (!model) return [];
  const modelTitle = model.title || '';
  const channel = model.category_id === 1 ? 'Nexa' : model.category_id === 3 ? 'Commercial' : 'Arena';
  const brochureUrl = model.file ? getFileUrl(model.file) : null;
  const rawHero = getStorageUrl(model.image);

  // Extract all unique colors & gallery images
  const colorMap = new Map();
  const extImages = new Set();
  const intImages = new Set();

  if (rawHero) extImages.add(rawHero);

  (model.varients || []).forEach((v) => {
    (v.products || []).forEach((p) => {
      const cName = p.color_name || p.color_name2;
      let cHex = p.colour_code || p.colour_code2 || '#4a5568';
      if (!cHex.startsWith('#')) cHex = '#' + cHex;
      if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cHex)) {
        if (/grey|gray|z7q/i.test(cName || cHex)) cHex = '#808285';
        else if (/silver|z2s/i.test(cName || cHex)) cHex = '#c0c0c0';
        else if (/red/i.test(cName || cHex)) cHex = '#d32f2f';
        else if (/blue/i.test(cName || cHex)) cHex = '#1976d2';
        else if (/white/i.test(cName || cHex)) cHex = '#f5f5f5';
        else if (/black/i.test(cName || cHex)) cHex = '#212121';
        else cHex = '#718096';
      }

      const img = p.images?.[0]?.images || p.image;
      if (cName && !colorMap.has(cName)) {
        colorMap.set(cName, {
          name: cName,
          hex: cHex,
          image: getStorageUrl(img) || rawHero,
        });
      }
      (p.images || []).forEach((i) => {
        if (i.images) extImages.add(getStorageUrl(i.images));
      });
    });

    (v.interior_images || []).forEach((intImg) => {
      if (intImg.interior_images) intImages.add(getStorageUrl(intImg.interior_images));
    });
  });

  const colors = Array.from(colorMap.values());
  const exteriorList = Array.from(extImages);
  const interiorList = Array.from(intImages);

  const rawVarients = model.varients || [];
  let minPrice = Infinity;
  const allFuels = new Set();
  const allTransmissions = new Set();

  const variants = rawVarients.map((v) => {
    const specs = (v.specifications || []).reduce((acc, s) => {
      if (s.specname && s.value) acc[s.specname.toLowerCase().trim()] = s.value;
      return acc;
    }, {});

    const firstProduct = (v.products || [])[0];
    const price = firstProduct?.tn_price || firstProduct?.tg_price || parseFloat(v.price) || null;
    if (price && price < minPrice) minPrice = price;

    const fuel = specs['fuel type'] || (v.var_title?.includes('CNG') ? 'CNG' : 'Petrol');
    const transmission = specs['transmission type'] || (v.var_title?.includes('AT') || v.var_title?.includes('AMT') ? 'Automatic' : 'Manual');

    allFuels.add(fuel);
    allTransmissions.add(transmission);

    let cleanName = v.var_title || '';
    if (cleanName.toLowerCase().startsWith(modelTitle.toLowerCase())) {
      cleanName = cleanName.slice(modelTitle.length).trim();
    }

    return {
      id: String(v.id),
      name: cleanName || v.var_title,
      fullName: v.var_title,
      price,
      exShowroomPrice: price,
      fuel,
      transmission,
      engine: specs['engine type'] || (specs['engine capacity'] ? `${specs['engine capacity']} cc` : '1.2L K-Series'),
      maxPower: specs['maximum power'] || '89.73 PS @ 6000 rpm',
      maxTorque: specs['maximum torque'] || '113 Nm @ 4400 rpm',
      mileage: specs['mileage'] || '22.89 km/l*',
      bootSpace: specs['boot space'] || specs['luggage capacity'] || '308 Litres',
      fuelTank: specs['fuel tank capacity'] ? `${specs['fuel tank capacity']} Litres` : '37 Litres',
      seatingCapacity: parseInt(specs['seating capacity'], 10) || 5,
      specs,
    };
  });

  const startingPrice = minPrice !== Infinity ? minPrice : (parseFloat(model.starting_price) || 650000);
  const priceRange = `From ₹ ${(startingPrice / 100000).toFixed(2)} Lakh*`;
  const firstV = variants[0] || {};
  const heroImage = colors[0]?.image || rawHero;

  const car = {
    ...firstV,
    id: String(model.id),
    name: modelTitle,
    slug: slug || apiNameToSlug(modelTitle),
    channel,
    tagline: model.seo_desc || model.description || 'Driven by Innovation',
    description: model.description || '',
    heroImage,
    startingPrice,
    priceRange,
    brochureUrl,
    colors: colors.length > 0 ? colors : [{ name: 'Standard', hex: '#163472', image: heroImage }],
    gallery: {
      exterior: exteriorList.length > 0 ? exteriorList : [heroImage],
      interior: interiorList,
    },
    images: exteriorList.length > 0 ? exteriorList : [heroImage],
    fuelTypes: Array.from(allFuels),
    transmissionTypes: Array.from(allTransmissions),
    variants,
  };

  return [car, ...variants.slice(1)];
}

export function normalizeCarVariant(raw, slug) {
  if (!raw) return null;
  if (raw.varients) {
    return normalizeCarDetails(raw, slug);
  }
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
  const q = raw.question || raw.title || '';
  const a = raw.answer || raw.description || '';
  return {
    id: String(raw.id),
    title: q,
    content: a,
    question: q,
    answer: a,
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
