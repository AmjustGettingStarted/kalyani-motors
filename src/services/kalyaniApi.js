/**
 * Kalyani Motors API Service Layer
 * Toggled with USE_MOCK to serve static mock datasets today,
 * but seamlessly switches to live backend endpoints tomorrow.
 */

import { apiClient } from './api';
import { mockBanners } from '../data/mockBanners';
import { mockCars } from '../data/mockCars';
import { mockLocations } from '../data/mockLocations';
import { mockServices } from '../data/mockServices';
import { mockFaqs } from '../data/mockFaqs';

export const USE_MOCK = true;

/**
 * Fetch home page aggregation data (banners, featured cars, testimonials, metrics)
 */
export async function getHomeData() {
  if (USE_MOCK) {
    return {
      banners: mockBanners,
      featuredCars: mockCars.filter((c) => c.isFeatured),
      metrics: {
        customersServed: '20+ Lakh',
        touchpoints: '100+',
        serviceBays: '450+',
        googleRating: '4.8/5',
        yearsOfTrust: '18+ Years',
      },
    };
  }
  return apiClient('home');
}

/**
 * Fetch car catalog with optional filtering
 */
export async function getModelCars(filters = {}) {
  if (USE_MOCK) {
    let result = [...mockCars];

    if (filters.channel && filters.channel !== 'All') {
      result = result.filter((c) => c.channel.toLowerCase() === filters.channel.toLowerCase());
    }
    if (filters.bodyType && filters.bodyType !== 'All') {
      result = result.filter((c) => c.bodyType.toLowerCase() === filters.bodyType.toLowerCase());
    }
    if (filters.fuel && filters.fuel !== 'All') {
      result = result.filter((c) => c.fuelTypes.includes(filters.fuel));
    }
    if (filters.transmission && filters.transmission !== 'All') {
      result = result.filter((c) => c.transmissionTypes.includes(filters.transmission));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.channel.toLowerCase().includes(q) ||
          c.bodyType.toLowerCase().includes(q)
      );
    }
    return result;
  }

  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v && v !== 'All') queryParams.append(k, v);
  });
  return apiClient(`cars?${queryParams.toString()}`);
}

/**
 * Fetch single car by URL slug
 */
export async function getCarBySlug(slug) {
  if (USE_MOCK) {
    const car = mockCars.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
    if (!car) throw new Error(`Car not found for slug: ${slug}`);
    return car;
  }
  return apiClient(`cars/${slug}`);
}

/**
 * Fetch dealership and workshop locations for a selected city
 */
export async function getLocations(city = 'bengaluru') {
  if (USE_MOCK) {
    const key = city.toLowerCase();
    return mockLocations[key] || mockLocations.bengaluru;
  }
  return apiClient(`locations?city=${city}`);
}

/**
 * Fetch all locations across all cities
 */
export async function getAllLocations() {
  if (USE_MOCK) {
    return mockLocations;
  }
  return apiClient('locations/all');
}

/**
 * Fetch service packages & periodic maintenance details
 */
export async function getServices() {
  if (USE_MOCK) {
    return mockServices;
  }
  return apiClient('services');
}

/**
 * Fetch customer FAQs
 */
export async function getFaqs() {
  if (USE_MOCK) {
    return mockFaqs;
  }
  return apiClient('faqs');
}

/**
 * Submit test drive inquiry
 */
export async function submitTestDrive(data) {
  if (USE_MOCK) {
    console.log('[Mock API] Test Drive submitted:', data);
    return {
      success: true,
      message: 'Test drive scheduled successfully! Our relationship manager will contact you shortly.',
      bookingId: `KL-TD-${Math.floor(100000 + Math.random() * 900000)}`,
      data,
    };
  }
  return apiClient('test-drive', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Submit service appointment booking
 */
export async function submitServiceBooking(data) {
  if (USE_MOCK) {
    console.log('[Mock API] Service Booking submitted:', data);
    return {
      success: true,
      message: 'Service appointment confirmed! A service advisor will inspect your vehicle.',
      appointmentId: `KL-SRV-${Math.floor(100000 + Math.random() * 900000)}`,
      data,
    };
  }
  return apiClient('service-bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Submit general inquiry / contact message
 */
export async function submitContactEnquiry(data) {
  if (USE_MOCK) {
    console.log('[Mock API] Contact Inquiry submitted:', data);
    return {
      success: true,
      message: 'Thank you for reaching out. We will get in touch with you within 2 business hours.',
      ticketId: `KL-ENQ-${Math.floor(100000 + Math.random() * 900000)}`,
      data,
    };
  }
  return apiClient('contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
