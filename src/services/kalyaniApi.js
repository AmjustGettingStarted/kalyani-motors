import { apiClient } from './api.js';
import {
  normalizeBanner,
  normalizeOutlet,
  normalizeIconLocation,
  normalizeModel,
  normalizeModelCars,
  normalizeCarDetails,
  normalizeService,
  normalizeCommonFaq,
  partitionByCity,
  normalizeCity,
  slugToApiName,
  getStorageUrl,
} from './normalizers.js';

export async function fetchAllModels() {
  const [models, categories, modelCars] = await Promise.all([
    apiClient('model'),
    apiClient('category').catch(() => []),
    apiClient('modelcars').catch(() => []),
  ]);

  const catMap = (categories || []).reduce((acc, cat) => {
    acc[cat.id] = cat.title;
    return acc;
  }, {});

  const modelCarsMap = (modelCars || []).reduce((acc, mc) => {
    const key = mc.car_model_id || mc.model?.id;
    if (key && !acc[key]) acc[key] = mc;
    return acc;
  }, {});

  return models
    .map((m) => normalizeModel(m, modelCarsMap, catMap))
    .sort((a, b) => a.position - b.position);
}

export async function fetchModelCars() {
  const data = await apiClient('modelcars');
  return normalizeModelCars(data);
}

export async function fetchAllModelList() {
  return apiClient('allmodellist');
}

/** Fetch variants for a given URL slug — handles slug-to-API name conversion */
export async function fetchCarBySlug(slug) {
  const apiName = slugToApiName(slug);
  const encoded = encodeURIComponent(apiName);
  const data = await apiClient(`varientbike?name=${encoded}`);
  if (!data || data.length === 0) throw new Error(`No car data for slug: ${slug}`);
  return normalizeCarDetails(data[0], slug);
}

export async function fetchBanners(isMobile = false) {
  const endpoint = isMobile ? 'mobilebanner' : 'banner';
  const data = await apiClient(endpoint);
  return partitionByCity(data.map(normalizeBanner), (b) => b.city);
}

export async function fetchIconLocations() {
  const data = await apiClient('iconlocation');
  return data.map(normalizeIconLocation);
}

export async function fetchOutlets() {
  const data = await apiClient('location');
  return data.map(normalizeOutlet);
}

export async function fetchServices() {
  const data = await apiClient('service');
  return data.map((s, idx) => normalizeService(s, idx));
}

export async function fetchServiceBanners() {
  const data = await apiClient('servicebanner');
  return partitionByCity(
    data.map((b) => ({
      id: String(b.id),
      imageUrl: `https://kalyanimotorsadmin.kalyanimotors.com/storage/${b.service_banner}`,
      image: `https://kalyanimotorsadmin.kalyanimotors.com/storage/${b.service_banner}`,
      city: normalizeCity(b.city),
    })),
    (b) => b.city
  );
}

export async function fetchServiceVideo() {
  const data = await apiClient('servicevideo');
  return data[0]?.youtube_link ?? '';
}

export async function fetchServiceFaq() {
  const data = await apiClient('servicefaq');
  return data.map(normalizeCommonFaq);
}

export async function fetchSeasonalServices() {
  const data = await apiClient('attachseasonservice');
  return data[0]?.services ?? [];
}

export async function fetchSeasons() {
  return apiClient('seasons');
}

export async function fetchCommonFaq() {
  const data = await apiClient('commonfaq');
  return data.map(normalizeCommonFaq);
}

export async function fetchBlogPages() {
  return apiClient('blogpage');
}

export async function fetchEnquiryBannerImg() {
  const data = await apiClient('enquirybannerimg');
  return {
    id: data[0]?.id ? String(data[0].id) : '1',
    imageUrl: data[0]?.banner_img ? getStorageUrl(data[0].banner_img) : '',
  };
}

export async function fetchPolicyBannerImg() {
  const data = await apiClient('policybannerimg');
  return {
    id: data[0]?.id ? String(data[0].id) : '1',
    imageUrl: data[0]?.policy_img ? getStorageUrl(data[0].policy_img) : '',
  };
}

export async function submitEnquiry(body) {
  return apiClient('enquiry', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ─── Form Submission Adapters ─────────────────────────────────────────────────

export async function submitTestDrive(data) {
  return submitEnquiry({
    name: data.fullName || data.name,
    phone: data.phone,
    email: data.email || '',
    city: data.city || 'Bengaluru',
    location: data.branch || data.location || data.city || 'Bengaluru',
    vehicle: data.carModel || data.vehicle || '',
    purpose: 'Book Test Drive',
  });
}

export async function submitServiceBooking(data) {
  return submitEnquiry({
    name: data.fullName || data.name,
    phone: data.phone,
    email: data.email || '',
    city: data.city || 'Bengaluru',
    location: data.workshop || data.location || data.city || 'Bengaluru',
    vehicle: data.carModel || data.vehicle || '',
    purpose: 'Book Service',
  });
}

export async function submitContactEnquiry(data) {
  return submitEnquiry({
    name: data.fullName || data.name,
    phone: data.phone,
    email: data.email || '',
    city: data.city || 'Bengaluru',
    location: data.city || 'Bengaluru',
    vehicle: data.model || data.vehicle || '',
    purpose: data.purpose || data.category || 'Vehicle Purchase Enquiry',
  });
}

// Legacy aliases
export const getHomeData = fetchAllModels;
export const getModelCars = fetchModelCars;
export const getCarBySlug = fetchCarBySlug;
export const getLocations = fetchOutlets;
export const getAllLocations = fetchOutlets;
export const getServices = fetchServices;
export const getFaqs = fetchCommonFaq;
