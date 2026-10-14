import { apiClient } from './api.js';
import {
  normalizeBanner,
  normalizeOutlet,
  normalizeIconLocation,
  normalizeModel,
  normalizeModelCars,
  normalizeCarVariant,
  normalizeService,
  normalizeCommonFaq,
  partitionByCity,
  normalizeCity,
  slugToApiName,
} from './normalizers.js';

export async function fetchAllModels() {
  const data = await apiClient('model');
  return data.map(normalizeModel);
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
  return data.map(normalizeCarVariant);
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

export async function fetchCommonFaq() {
  const data = await apiClient('commonfaq');
  return data.map(normalizeCommonFaq);
}

export async function fetchBlogPages() {
  return apiClient('blogpage');
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
