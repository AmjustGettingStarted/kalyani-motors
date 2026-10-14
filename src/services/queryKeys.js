/**
 * Centralized TanStack Query cache keys
 */

export const QUERY_KEYS = {
  models:           ['models'],
  categories:       ['categories'],
  nexaModels:       ['nexa-models'],
  commercialModels: ['commercial-models'],
  modelCars:        ['model-cars'],
  allModelList:     ['all-model-list'],
  carBySlug:        (slug) => ['car', slug],
  banners:          (isMobile) => ['banners', isMobile],
  enquiryBanner:    ['enquiry-banner'],
  policyBanner:     ['policy-banner'],
  iconLocations:    ['icon-locations'],
  outlets:          ['outlets'],
  services:         ['services'],
  serviceBanners:   ['service-banners'],
  serviceVideo:     ['service-video'],
  serviceFaq:       ['service-faq'],
  seasons:          ['seasons'],
  seasonalServices: ['seasonal-services'],
  commonFaq:        ['common-faq'],
  blogPages:        ['blog-pages'],
};
