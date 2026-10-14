# Kalyani Motors Redesign — API Integration Blueprint

> **Project:** `kalyani-motors-redesign` (React 19 + React Router 7 + CRA)
> **Stack Constraints:** CRA `react-scripts 5`, cPanel static hosting (`public_html/build/`), no Node.js server runtime.
> **Backend:** Immutable legacy API — all quirks handled client-side only.
> **Date:** October 2026 | **Status:** Pre-Integration Planning

---

## Table of Contents

1. [Technology & Architecture Recommendation](#1-technology--architecture-recommendation)
2. [Mock-to-API Replacement Matrix](#2-mock-to-api-replacement-matrix)
3. [Client-Side Adapter & Normalization Layer Design](#3-client-side-adapter--normalization-layer-design)
4. [Component-by-Component Migration Phases](#4-component-by-component-migration-phases)
5. [Risk Assessment & Fallback Strategy](#5-risk-assessment--fallback-strategy)

---

## 1. Technology & Architecture Recommendation

### 1.1 Current Stack Audit

| Concern | Current State | Problem |
|:---|:---|:---|
| HTTP Client | Native `fetch` in `src/services/api.js` | OK — no Axios dependency |
| Data Fetching | `USE_MOCK = true` flag in `kalyaniApi.js` | No caching — every component re-fetches |
| State Management | Plain React Context (`KalyaniContext`) seeded with static mock objects | No loading/error states for async data |
| Global Shared Data | Context hardwired to `mockCars`, `mockLocations`, `mockServices`, `mockFaqs` | Must be replaced with live fetch + async lifecycle |
| Mutation/Form Handling | `async/await` inside `handleSubmit` with manual `isSubmitting` state | Works but fragile — no shared retry or dual-dispatch orchestration |

### 1.2 Decision: Axios vs Native Fetch

**Recommendation: Keep Native `fetch`** — do NOT introduce Axios.

**Rationale:**
- `api.js` already has a clean `fetch`-based wrapper (`apiClient`) with error normalization.
- React 19 ships improvements to `use()` and streaming suspense that pair naturally with native `fetch` + `Promise`.
- Axios adds ~15 KB gzipped bundle weight for features we don't need (interceptors, transforms) since all transformations are done in adapter functions.
- The Zuqo CRM calls require a custom `Authorization` header — trivially handled with the existing `options.headers` spread in `apiClient`.
- **Exception:** The Zuqo CRM endpoint is on a non-standard port (`:4342`) and a different domain — it stays as a raw `fetch` call inside a dedicated `zuqoClient` function.

### 1.3 Decision: TanStack Query vs React Context + useEffect vs SWR vs Zustand

**Recommendation: TanStack Query v5 (React Query)**

**Evaluated Options:**

| Option | Pros | Cons | Verdict |
|:---|:---|:---|:---|
| **Plain Context + useEffect** | Already in codebase, zero deps | No caching, no deduplication, refetch on every mount, manual loading/error state in every component | Eliminated |
| **SWR** | Lightweight, simple | No built-in mutation, inferior devtools, less React 19 integration | Acceptable fallback only |
| **Zustand** | Great global store | Not designed for async server data — still requires manual cache invalidation | Wrong tool |
| **TanStack Query v5** | Stale-while-revalidate, built-in caching with `staleTime`, `gcTime`, deduplicates parallel requests, `useMutation` with `onError`/`onSuccess`, React 19 compatible, excellent devtools | 48 KB gzipped | **Selected** |

**Why TanStack Query wins here:**

1. **Caching requirement:** `/api/model`, `/api/category`, `/api/location`, `/api/iconlocation` rarely change. Setting `staleTime: 1000 * 60 * 60` (1 hour) prevents any re-fetch during a session, eliminating the current problem where `KalyaniContext` re-seeds on every render because it's synchronous mock data.

2. **Parallel requests:** `Promise.all` replacement is handled automatically by co-located `useQuery` hooks — React Query deduplicates concurrent requests to the same key across the component tree.

3. **Mutation loading/error for forms:** `useMutation` gives us `isPending`, `isError`, `error`, `isSuccess` out of the box for every form (EnquiryModal, TestDriveModal, ServiceBooking, ContactForm) without writing manual `isSubmitting` state.

4. **React 19 + CRA compatibility:** `@tanstack/react-query` v5 fully supports React 19 concurrent features. CRA with `react-scripts 5` supports it without ejecting.

5. **No SSR requirement:** Since deployment is cPanel static hosting, we never need server-side query prefetching — client-only is fine.

### 1.4 Final Recommended Data-Fetching Stack

```
React 19 + React Router 7 + CRA
│
├── src/services/api.js          ← Native fetch wrapper (keep, minor extension)
├── src/services/kalyaniApi.js   ← API functions (remove USE_MOCK flag, pure live)
├── src/services/zuqoClient.js   ← NEW: Dedicated Zuqo CRM 2-step pipeline
├── src/services/normalizers.js  ← NEW: All legacy-quirk transformation functions
│
└── TanStack Query v5
    ├── QueryClientProvider       → wrap in src/index.js
    ├── useQuery()                → all GET data (catalog, banners, locations, FAQs)
    ├── useMutation()             → all POST forms (enquiry, test drive, service booking)
    └── queryClient.prefetchQuery → optional prefetch in layout for iconlocation + blogpage
```

**KalyaniContext is retained but scoped to UI state only:**
- `selectedCity` (string) + `setSelectedCity` — stays in Context (UI/preference state)
- `testDriveModal` (open/close/selectedCar) — stays in Context (cross-component UI event)
- `cars`, `banners`, `locations`, `services`, `faqs` — **MOVED** out of Context into React Query hooks

---

## 2. Mock-to-API Replacement Matrix

> **CDN Rules (applied by normalizers, never in components):**
> - Images/banners/car photos/icons: `https://kalyanimotorsadmin.kalyanimotors.com/storage/{path}`
> - Brochures/PDFs: `https://kalyanimotorsadmin.kalyanimotors.com/{path}`

### 2.1 Home Page

| Page / Component | Current Static Source | Target API Endpoint(s) | Key Fields to Map | Asset URL Handling |
|:---|:---|:---|:---|:---|
| `home/page.jsx` → `HeroVideo` | Hardcoded Vimeo/local video | `GET /api/banner` (desktop) / `GET /api/mobilebanner` (mobile ≤576px) | `banner_img`, `city`, `link`, `title` | `storage/{banner_img}` prefix |
| `home/page.jsx` → `FeaturedCarsSection` | `mockCars` via `useKalyani().cars` | `GET /api/model` + `GET /api/modelcars` | `id`, `title`, `image`, `body`, `fuel`, `transmission` | `storage/{image}` prefix |
| `home/page.jsx` → `NearestBranchesSection` | `mockLocations` via `useKalyani().locations` | `GET /api/iconlocation` | `title`, `phone_number`, `address`, `city` (numeric → string normalize) | `storage/{icon}` if present |
| `home/page.jsx` → `FaqSection` | `mockFaqs` via `useKalyani().faqs` | `GET /api/commonfaq` | `id`, `question`, `answer` | No assets |
| `home/page.jsx` → `WhyChooseKalyaniSection` | Hardcoded static metrics | `GET /api/iconlocation` (phone, address) | `phone_number`, `address` (for regional contacts) | No assets |
| `home/page.jsx` → `EnquiryPopupModal` | `mockCars` for model dropdown | `GET /api/allmodellist` | `id`, `name` | No assets |
| Hero background (on-road price banner) | None / static CSS | `GET /api/enquirybannerimg` | `banner_img` (first element) | `storage/{banner_img}` prefix |
| Policy/assurance banner | None / static CSS | `GET /api/policybannerimg` | `policy_img` (first element) | `storage/{policy_img}` prefix |
| Footer dynamic links | Hardcoded `<Link>` elements in `Footer.jsx` | `GET /api/blogpage` | `title`, `blogpage_link` | No assets |

### 2.2 Cars Listing Page (`/cars`)

| Page / Component | Current Static Source | Target API Endpoint(s) | Key Fields to Map | Asset URL Handling |
|:---|:---|:---|:---|:---|
| `cars/page.jsx` filter data | `mockCars` via `useKalyani().cars` | `GET /api/model` + `GET /api/category` + `GET /api/nexa` + `GET /api/commercial` | `id`, `title`, `image`, `category_id` | `storage/{image}` |
| `cars/page.jsx` channel tabs | Hardcoded `['All', 'Arena', 'Nexa', 'Commercial']` | `GET /api/category` | `id`, `title` (channel name) | No assets |
| `cars/page.jsx` body/fuel/transmission filters | Derived from `mockCars` arrays | `GET /api/modelcars` | `body` (split `/`), `fuel` (split `/`), `transmission` (split `/`) | No assets |
| `cars/page.jsx` → `HeroPromoCarousel` | `mockBanners` | `GET /api/banner` (city-partitioned) | `banner_img`, `city`, `link`, `title` | `storage/{banner_img}` |
| `CarCard` component | `mockCars[*]` data shape | Normalized output from `/api/model` + `/api/modelcars` | `name`, `image`, `startingPrice`, `channel`, `bodyType`, `slug` | `storage/{image}` |

### 2.3 Car Detail Page (`/cars/[slug]`)

| Page / Component | Current Static Source | Target API Endpoint(s) | Key Fields to Map | Asset URL Handling |
|:---|:---|:---|:---|:---|
| `cars/[slug]/page.jsx` — all car data | `mockCars.find(c => c.slug === slug)` via `useKalyani().cars` | `GET /api/varientbike?name={modelName}` | `name`, `body`, `fuel`, `transmission`, `price`, `engine`, `mileage`, `seating_capacity`, `boot_space` | See below |
| Hero image / gallery | Local imported PNG files (`fronxHero`, etc.) | `GET /api/varientbike?name=...` → `images: [{ images: string }]` | `images[*].images` | `storage/{images}` |
| Color picker | Local PNG imports per color | `GET /api/varientbike?name=...` → `colors: [{ color_code, color_name, image }]` | `color_code`, `color_name`, `image` | `storage/{image}` |
| Variant selector | `mockCars[*].variants[]` | `GET /api/varientbike?name=...` → `varient: { id, var_title, price, ex_showroom_price }` | `var_title`, `price`, `ex_showroom_price` | No assets |
| Brochure download | Hardcoded PDF link or none | `GET /api/varientbike?name=...` → `brochure?: string` | `brochure` | `/{brochure}` (admin root, NOT storage/) |
| Related/similar cars | Other `mockCars` entries | `GET /api/model` (all models) | `id`, `title`, `image` | `storage/{image}` |
| **Slug → API name mapping** | URL slug (e.g. `fronx`) | Client transform needed: lookup table in `normalizers.js` | Must prefix `"Maruti Suzuki "` to slug-derived name | N/A |

> **Critical slug mapping note:** The API endpoint `/api/varientbike?name=` expects the full brand-prefixed name like `Maruti Suzuki Swift`. Current slugs (e.g. `fronx`, `grand-vitara`) must be expanded using a lookup table defined in `src/services/normalizers.js`. See Section 3 for the full lookup map.

### 2.4 Outlets Page (`/outlets`)

| Page / Component | Current Static Source | Target API Endpoint(s) | Key Fields to Map | Asset URL Handling |
|:---|:---|:---|:---|:---|
| `outlets/page.jsx` — outlet cards | `mockLocations` (direct import, bypasses context!) | `GET /api/location` | `id`, `city`, `type`, `category.title`, `title`, `address`, `phone_number`, `email`, `latitude`, `longtitude` | No assets |
| Google Maps link | Hardcoded `mapUrl` in mockLocations | Derived from `latitude` + normalized `longitude` | Build `https://maps.google.com/?q={lat},{lng}` | No assets |
| Phone dialer | Mock `phone` field | `phone_number` from `/api/location` | Direct use | No assets |
| City tabs | Hardcoded `['Bengaluru','Hyderabad','Mysore','Chennai']` | `city` field from `/api/location` (string, lowercase) | Normalize: `"bangalore"` → `"Bengaluru"` | No assets |
| Channel/category tabs | Hardcoded `['Arena','Nexa','Commercial','True Value']` | `category.title` from `/api/location` | Direct use | No assets |

### 2.5 Contact Page (`/contact`)

| Page / Component | Current Static Source | Target API Endpoint(s) | Key Fields to Map | Asset URL Handling |
|:---|:---|:---|:---|:---|
| `contact/page.jsx` — city selector | `useKalyani().cities` (static array) | `GET /api/iconlocation` | `title` (city name), `phone_number` | No assets |
| Regional phone number display | None currently | `GET /api/iconlocation` | `phone_number` per city/region | No assets |
| FAQ section | `useKalyani().faqs` (mockFaqs) | `GET /api/commonfaq` | `question`, `answer` | No assets |
| Contact form submission | `submitContactEnquiry()` — mock console.log | `POST /api/enquiry` + Zuqo 2-step pipeline | `name`, `phone`, `email`, `city`, `location`, `vehicle`, `purpose` | No assets |

### 2.6 Service Page (`/service`)

| Page / Component | Current Static Source | Target API Endpoint(s) | Key Fields to Map | Asset URL Handling |
|:---|:---|:---|:---|:---|
| `service/page.jsx` → `heroImages` | `mockServices.heroImages` (Unsplash URLs) | `GET /api/servicebanner` | `service_banner`, `city` | `storage/{service_banner}` |
| `service/page.jsx` → `serviceCategories` | `mockServices.serviceCategories` | `GET /api/service` | `id`, `title`, `image`, `description`, `points` | `storage/{image}` |
| Seasonal service packages | `mockServices.seasonalPackages` | `GET /api/attachseasonservice` + `GET /api/seasons` | `title`, `services[*].{id, title, image, description}` | `storage/{image}` |
| Service FAQ accordion | `mockFaqs` (shared) | `GET /api/servicefaq` | `id`, `question`, `answer` | No assets |
| Workshop promo video | None / hardcoded | `GET /api/servicevideo` | `youtube_link` (first element) | External YouTube URL |
| Service booking form | `submitServiceBooking()` — mock | `POST /api/enquiry` + Zuqo 2-step (purpose: `"Book Service"`) | `name`, `phone`, `vehicle`, `purpose`, `location`, `city` | No assets |
| Workshop selector | `mockLocations[city][*]` | `GET /api/location` filtered by `type: "Workshop"` | `id`, `title`, `address` | No assets |

### 2.7 Enquiry Modals & Global Lead Forms

| Component | Current Behaviour | Target Behaviour | API Endpoints |
|:---|:---|:---|:---|
| `EnquiryPopupModal.jsx` | Calls `submitContactEnquiry()` — mock | Dual dispatch: `POST /api/enquiry` + Zuqo 2-step | Both simultaneously via `Promise.allSettled` |
| `TestDriveModal.jsx` | Calls `submitTestDrive()` — mock | Dual dispatch: `POST /api/enquiry` (purpose: `"Book Test Drive"`) + Zuqo 2-step | Both simultaneously via `Promise.allSettled` |
| `service/page.jsx` booking form | Calls `submitServiceBooking()` — mock | Dual dispatch: `POST /api/enquiry` (purpose: `"Book Service"`) + Zuqo 2-step | Both simultaneously via `Promise.allSettled` |
| `contact/page.jsx` contact form | Calls `submitContactEnquiry()` — mock | Dual dispatch: `POST /api/enquiry` + Zuqo 2-step | Both simultaneously via `Promise.allSettled` |
| `cars/[slug]/page.jsx` On Road Price CTA | Calls `openTestDrive()` | `POST /api/enquiry` (purpose: `"On Road Price"`) + Zuqo 2-step | `GET /api/allmodellist` for dropdown |
| Model dropdown in all forms | `mockCars` array | `GET /api/allmodellist` | `id`, `name` |
| City dropdown in all forms | Static `CITIES` array | `GET /api/iconlocation` — extract unique `title` values | `title` field |

---

## 3. Client-Side Adapter & Normalization Layer Design

### 3.1 File Structure Plan

```
src/
├── services/
│   ├── api.js              ← EXISTING: native fetch wrapper (extend for Zuqo base URL)
│   ├── kalyaniApi.js       ← REFACTOR: remove USE_MOCK, export pure async functions
│   ├── zuqoClient.js       ← NEW: Zuqo CRM 2-step pipeline
│   ├── normalizers.js      ← NEW: all data transformation / legacy quirk adapters
│   └── queryKeys.js        ← NEW: centralized TanStack Query key constants
├── context/
│   ├── KalyaniContext.jsx  ← REFACTOR: UI state only (city, modals)
│   └── QueryProvider.jsx   ← NEW: QueryClient + QueryClientProvider wrapper
```

### 3.2 `src/services/api.js` — Extended

The existing `apiClient` function is nearly perfect. Only two additions are needed:

```javascript
// src/services/api.js

const BASE_URL = 'https://kalyanimotorsapi.kalyanimotors.com/api/';
export const STORAGE_CDN = 'https://kalyanimotorsadmin.kalyanimotors.com/storage/';
export const ADMIN_ROOT = 'https://kalyanimotorsadmin.kalyanimotors.com/';
const ZUQO_BASE = 'https://demo.zuqodemo.world:4342/';

export async function apiClient(endpoint, options = {}) {
  // ... (existing implementation, unchanged)
}

// NEW: separate client for Zuqo CRM (different base URL + auth header)
export async function zuqoClient(path, body) {
  const url = `${ZUQO_BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // NOTE: This JWT is long-lived and public in the legacy codebase.
      // In a future iteration, move this to a server proxy.
      'Authorization': 'Axi12#$ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNjY2MTJiYWU4MjkwZjZiNWI2ZjAwOTk5IiwiaWF0IjoxNzQyMTg0Mjc2LCJleHAiOjE3NzM3MjAyNzZ9.Z-rMS2RklsawdXAZNHYQ3x6BiRB_AdkCeMbRyWIZPm0',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Zuqo HTTP ${res.status}`);
  return res.json();
}
```

### 3.3 `src/services/normalizers.js` — Full Specification

This file is the core of the legacy adaptation layer. **Components must never access raw API shapes — only normalized outputs.**

```javascript
// src/services/normalizers.js
import { STORAGE_CDN, ADMIN_ROOT } from './api';

// ─── CDN Asset Helpers ────────────────────────────────────────────────────────

/** Prepend storage CDN to any relative image path returned by the API */
export function getStorageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path; // already absolute
  return `${STORAGE_CDN}${path}`;
}

/** For brochures/PDFs (admin root, NOT /storage/) */
export function getFileUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${ADMIN_ROOT}${path}`;
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
  hydrabad: 'Hyderabad',   // legacy typo from API
  mysore: 'Mysore',
  chennai: 'Chennai',
};

export function normalizeCity(rawCity) {
  if (typeof rawCity === 'number') return NUMERIC_CITY_MAP[rawCity] ?? 'Bengaluru';
  if (typeof rawCity === 'string') return CITY_STRING_MAP[rawCity.toLowerCase()] ?? rawCity;
  return 'Bengaluru';
}

// ─── Slug to API Name Lookup Table ────────────────────────────────────────────
// /api/varientbike?name= expects the FULL brand-prefixed model name.
// Our URL slugs are short (e.g. 'fronx', 'grand-vitara').

export const SLUG_TO_API_NAME = {
  'alto':              'Maruti Suzuki Alto',
  'alto-k10':          'Maruti Suzuki Alto K10',
  'celerio':           'Maruti Suzuki Celerio',
  'swift':             'Maruti Suzuki Swift',
  'wagon-r':           'Maruti Suzuki WagonR',
  'dzire':             'Maruti Suzuki Dzire',
  'ertiga':            'Maruti Suzuki Ertiga',
  'brezza':            'Maruti Suzuki Brezza 2022',
  'eeco':              'Maruti Suzuki Eeco',
  's-presso':          'Maruti Suzuki S-Presso',
  'fronx':             'Maruti Suzuki Fronx',
  'baleno':            'Maruti Suzuki Baleno',
  'ignis':             'Maruti Suzuki Ignis',
  'ciaz':              'Maruti Suzuki Ciaz',
  'xl6':               'Maruti Suzuki XL6',
  'grand-vitara':      'Maruti Suzuki Grand Vitara',
  'jimny':             'Maruti Suzuki Jimny',
  'invicto':           'Maruti Suzuki Invicto',
  'super-carry':       'Maruti Suzuki Super Carry',
  'eeco-cargo':        'Maruti Suzuki Eeco Cargo',
  'tour-h1':           'Maruti Suzuki Tour H1',
  'tour-h3':           'Maruti Suzuki Tour H3',
  'tour-s':            'Maruti Suzuki Tour S',
  'tour-v':            'Maruti Suzuki Tour V',
  'tour-m':            'Maruti Suzuki Tour M',
};

export function slugToApiName(slug) {
  return SLUG_TO_API_NAME[slug?.toLowerCase()] ?? slug?.replace(/-/g, ' ');
}

export function apiNameToSlug(name) {
  return Object.entries(SLUG_TO_API_NAME)
    .find(([, v]) => v.toLowerCase() === name?.toLowerCase())?.[0]
    ?? name?.toLowerCase().replace(/\s+/g, '-');
}

// ─── Slash-Delimited Spec Splitter ────────────────────────────────────────────

/** Split "Petrol/CNG" → ['Petrol', 'CNG'], deduplicate, trim */
export function splitSlashSpec(raw) {
  if (!raw) return [];
  return [...new Set(raw.split('/').map((s) => s.trim()).filter(Boolean))];
}

// ─── Longitude Typo Fix ───────────────────────────────────────────────────────

/** Corrects the 'longtitude' typo and returns a clean GPS coordinates object */
export function normalizeGps(rawOutlet) {
  return {
    latitude: parseFloat(rawOutlet.latitude) || null,
    longitude: parseFloat(rawOutlet.longtitude ?? rawOutlet.longitude) || null,
  };
}

/** Build a Google Maps URL from a raw outlet object */
export function buildMapsUrl(rawOutlet) {
  const { latitude, longitude } = normalizeGps(rawOutlet);
  if (!latitude || !longitude) return null;
  return `https://maps.google.com/?q=${latitude},${longitude}`;
}

// ─── Entity Normalizers ───────────────────────────────────────────────────────

/** Normalize a raw /api/location outlet record */
export function normalizeOutlet(raw) {
  return {
    id: raw.id,
    name: raw.title,
    city: normalizeCity(raw.city),
    type: raw.type,            // "Showroom" | "Workshop" | "True Value"
    category: raw.category?.title ?? '',  // "Arena" | "Nexa" | "Commercial"
    address: raw.address,
    phone: raw.phone_number,
    email: raw.email,
    gps: normalizeGps(raw),
    mapsUrl: buildMapsUrl(raw),
  };
}

/** Normalize a raw /api/iconlocation record */
export function normalizeIconLocation(raw) {
  return {
    id: raw.id,
    city: normalizeCity(raw.city),  // numeric → string
    cityTitle: raw.title,
    phone: raw.phone_number,
    address: raw.address,
    icon: getStorageUrl(raw.icon),
  };
}

/** Normalize a banner record from /api/banner or /api/mobilebanner */
export function normalizeBanner(raw) {
  return {
    id: raw.id,
    imageUrl: getStorageUrl(raw.banner_img),
    city: normalizeCity(raw.city),
    link: raw.link ?? null,
    title: raw.title ?? null,
  };
}

/** Normalize a raw /api/varientbike car variant record */
export function normalizeCarVariant(raw) {
  return {
    id: raw.id,
    name: raw.name,
    slug: apiNameToSlug(raw.name),
    bodyType: raw.body,
    fuelTypes: splitSlashSpec(raw.fuel),
    transmissionTypes: splitSlashSpec(raw.transmission),
    startingPrice: parseFloat(raw.price) || null,
    engine: raw.engine,
    mileage: raw.mileage,
    seatingCapacity: raw.seating_capacity,
    bootSpace: raw.boot_space,
    images: (raw.images ?? []).map((img) => getStorageUrl(img.images)),
    variant: raw.varient
      ? {
          id: raw.varient.id,
          name: raw.varient.var_title,
          price: parseFloat(raw.varient.price) || null,
          exShowroomPrice: parseFloat(raw.varient.ex_showroom_price) || null,
        }
      : null,
    brochureUrl: raw.brochure ? getFileUrl(raw.brochure) : null,
    colors: (raw.colors ?? []).map((c) => ({
      code: c.color_code,
      name: c.color_name,
      image: getStorageUrl(c.image),
    })),
  };
}

/** Normalize a raw /api/model record */
export function normalizeModel(raw) {
  return {
    id: raw.id,
    name: raw.title,
    slug: apiNameToSlug(raw.title),
    image: getStorageUrl(raw.image),
    categoryId: raw.category_id,
    position: raw.position ?? 999,
  };
}

/** Normalize /api/modelcars — handles slash-split multi-values + position sort */
export function normalizeModelCars(rawArray) {
  return rawArray
    .map((item) => ({
      id: item.id,
      name: item.name,
      slug: apiNameToSlug(item.name),
      bodyTypes: splitSlashSpec(item.body),
      transmissionTypes: splitSlashSpec(item.transmission),
      fuelTypes: splitSlashSpec(item.fuel),
      position: item.model?.position ?? 999,
      modelTitle: item.model?.title ?? item.name,
      images: (item.images ?? []).map((img) => getStorageUrl(img.images)),
    }))
    .sort((a, b) => a.position - b.position);
}

/** Normalize /api/service record */
export function normalizeService(raw) {
  return {
    id: raw.id,
    title: raw.title,
    image: getStorageUrl(raw.image),
    description: raw.description,
    points: raw.points ?? [],
    price: raw.price ?? null,
    slug: raw.title?.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-'),
  };
}

/** Partition a flat array into a city-keyed object */
export function partitionByCity(items, getCityFn) {
  return items.reduce((acc, item) => {
    const city = getCityFn(item);
    if (!acc[city]) acc[city] = [];
    acc[city].push(item);
    return acc;
  }, {});
}
```

### 3.4 `src/services/kalyaniApi.js` — Refactored (Live Only, Key Functions)

Replace the entire file with pure async functions — no `USE_MOCK` flag, no mock imports.

```javascript
// src/services/kalyaniApi.js
import { apiClient } from './api';
import {
  normalizeBanner, normalizeOutlet, normalizeIconLocation,
  normalizeModel, normalizeModelCars, normalizeCarVariant,
  normalizeService, partitionByCity, normalizeCity, slugToApiName,
} from './normalizers';

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
  return data.map(normalizeService);
}

export async function fetchServiceBanners() {
  const data = await apiClient('servicebanner');
  return partitionByCity(
    data.map((b) => ({
      imageUrl: `https://kalyanimotorsadmin.kalyanimotors.com/storage/${b.service_banner}`,
      city: normalizeCity(b.city),
    })),
    (b) => b.city,
  );
}

export async function fetchServiceVideo() {
  const data = await apiClient('servicevideo');
  return data[0]?.youtube_link ?? '';
}

export async function fetchServiceFaq() {
  return apiClient('servicefaq');
}

export async function fetchSeasonalServices() {
  const data = await apiClient('attachseasonservice');
  return data[0]?.services ?? [];
}

export async function fetchCommonFaq() {
  return apiClient('commonfaq');
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
```

### 3.5 `src/services/zuqoClient.js` — Dual Lead Dispatch Pipeline

```javascript
// src/services/zuqoClient.js
import { zuqoClient as zuqoFetch } from './api';
import { submitEnquiry } from './kalyaniApi';

const ZUQO_CAMPAIGN_ID = '688c5d85d5e83faa10312c15';
const ZUQO_PROCESS = 'KAM';

function cityToZuqoRouting(city) {
  const c = city?.toLowerCase() ?? '';
  if (c.includes('bengaluru') || c.includes('bangalore')) return 'website_bnglre';
  if (c.includes('mysore')) return 'website_mys';
  if (c.includes('hyderabad') || c.includes('hydrabad')) return 'website_hyd';
  return '';
}

async function resolveZuqoSkill(location) {
  const result = await zuqoFetch('admin/getRoutingSkillForUpload/', {
    process: ZUQO_PROCESS,
    mobileNumber: cityToZuqoRouting(location),
  });
  return result?.data?.selectedDid ?? null;
}

async function uploadLeadToZuqo(leadData, skillData) {
  return zuqoFetch('admin/campaign/uploadLeadsToWeb', [
    {
      Name: leadData.name,
      'Phone Number': leadData.phone,
      'Email Address': leadData.email ?? '',
      emailAddress: leadData.email ?? '',
      crmSource: 'KM Website',
      creAgent: skillData?.agentId ?? '',
      agentId: skillData?.agentId ?? '',
      skill: skillData?.skill ?? '',
      process: ZUQO_PROCESS,
      campaignId: ZUQO_CAMPAIGN_ID,
      campaignName: 'Kalyani Motors',
      requestFrom: 'website',
      uniquePhone: true,
      modelName: leadData.vehicle ?? leadData.model ?? '',
      purpose: leadData.purpose,
      location: leadData.location ?? leadData.city ?? '',
    },
  ]);
}

async function runZuqoPipeline(leadData) {
  const skillData = await resolveZuqoSkill(leadData.location ?? leadData.city);
  return uploadLeadToZuqo(leadData, skillData);
}

/**
 * PRIMARY EXPORT: submitLead()
 *
 * Dispatches to BOTH the internal API and Zuqo CRM simultaneously.
 * Uses Promise.allSettled so a Zuqo failure NEVER blocks the internal lead.
 *
 * @param {object} leadData
 * @param {string} leadData.name       - Customer full name
 * @param {string} leadData.phone      - 10-digit mobile
 * @param {string} [leadData.email]    - Customer email (optional)
 * @param {string} leadData.city       - Canonical city (e.g. "Bengaluru")
 * @param {string} leadData.location   - Branch address or city name
 * @param {string} leadData.vehicle    - Car model name
 * @param {string} leadData.purpose    - Lead intent string
 */
export async function submitLead(leadData) {
  const internalPayload = {
    name: leadData.name,
    phone: leadData.phone,
    email: leadData.email ?? '',
    city: leadData.city,
    location: leadData.location ?? leadData.city,
    vehicle: leadData.vehicle ?? '',
    purpose: leadData.purpose,
  };

  const [internalResult, zuqoResult] = await Promise.allSettled([
    submitEnquiry(internalPayload),
    runZuqoPipeline(leadData),
  ]);

  // Propagate internal API failure as a thrown error (forms show error state)
  if (internalResult.status === 'rejected') {
    throw new Error(internalResult.reason?.message ?? 'Enquiry submission failed');
  }

  // Log Zuqo failure silently — lead is already saved internally
  if (zuqoResult.status === 'rejected') {
    console.warn('[Zuqo CRM] Lead upload failed (non-blocking):', zuqoResult.reason);
  }

  return { internal: internalResult.value, zuqo: zuqoResult.value ?? null };
}
```

### 3.6 `src/services/queryKeys.js`

```javascript
// src/services/queryKeys.js
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
```

---

## 4. Component-by-Component Migration Phases

### Phase 1: Foundation Layer
> **Goal:** Install TanStack Query, configure QueryClient, extend `api.js`, create `normalizers.js`, `zuqoClient.js`, `queryKeys.js`, and `QueryProvider.jsx`. No UI changes yet — all mock data still works during this phase.

**Step 1.1 — Install TanStack Query**
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**Step 1.2 — Create `src/services/QueryProvider.jsx`**
```jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,     // 1 hour — catalog/location data is static
      gcTime:    1000 * 60 * 60 * 4,  // garbage collect after 4 hours
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

**Step 1.3 — Wrap `src/index.js`**
```jsx
import QueryProvider from './services/QueryProvider';

root.render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <KalyaniProvider>
          <App />
        </KalyaniProvider>
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>
);
```

**Step 1.4** — Create `src/services/normalizers.js` (full content from §3.3).

**Step 1.5** — Create `src/services/zuqoClient.js` (full content from §3.5).

**Step 1.6** — Create `src/services/queryKeys.js` (full content from §3.6).

**Step 1.7** — Refactor `src/services/kalyaniApi.js`: delete `USE_MOCK = true` and all mock imports; replace mock returns with pure async functions from §3.4.

**Step 1.8 — Create `.env` in project root**
```env
REACT_APP_API_BASE=https://kalyanimotorsapi.kalyanimotors.com/api/
REACT_APP_STORAGE_CDN=https://kalyanimotorsadmin.kalyanimotors.com/storage/
REACT_APP_ADMIN_ROOT=https://kalyanimotorsadmin.kalyanimotors.com/
REACT_APP_ZUQO_BASE=https://demo.zuqodemo.world:4342/
```
Update `api.js` to read `process.env.REACT_APP_*` for each constant.

---

### Phase 2: Global State & Shared Data
> **Goal:** Replace `KalyaniContext` mock data with live React Query hooks. Keep UI-only state (city selector, modal) in Context.

**Step 2.1 — Refactor `src/context/KalyaniContext.jsx`**

Remove: all mock imports (`mockCars`, `mockBanners`, `mockLocations`, `mockServices`, `mockFaqs`).

Keep in Context value:
- `selectedCity` / `setSelectedCity` (localStorage-backed preference)
- `testDriveModal` / `openTestDrive` / `closeTestDrive`
- `cities` (static constant array `['Bengaluru', 'Hyderabad', 'Mysore', 'Chennai']`)

Remove from Context value (now from React Query):
- `cars`, `banners`, `locations`, `allLocations`, `services`, `faqs`

Fix `openTestDrive()` — it currently defaults to `mockCars[0]` when `car` is null. Replace with a lightweight `null` fallback; the `TestDriveModal` will source the car list from `useQuery` directly.

**Step 2.2 — Create custom hooks for shared data**

Create `src/components/hooks/useIconLocations.js`, `useModels.js`, `useBanners.js`, `useOutlets.js`, `useServices.js`, `useCommonFaq.js`, `useBlogPages.js` — each wrapping the corresponding `fetchXxx()` function with `useQuery`.

Example pattern:
```javascript
import { useQuery } from '@tanstack/react-query';
import { fetchIconLocations } from '../../services/kalyaniApi';
import { QUERY_KEYS } from '../../services/queryKeys';

export function useIconLocations() {
  return useQuery({
    queryKey: QUERY_KEYS.iconLocations,
    queryFn: fetchIconLocations,
  });
}
```

**Step 2.3 — Update `Header.jsx`**
- Pull `iconLocations` via `useIconLocations()` for per-city phone number in the header strip.
- Pull `blogPages` via `useBlogPages()` for dynamic nav links if needed.
- `selectedCity` still reads from `useKalyani()` (UI preference state).

**Step 2.4 — Update `Footer.jsx`**
- Pull `blogPages` via `useBlogPages()` and render dynamic footer navigation links.
- Filter: links where `blogpage_link.startsWith('http')` render as `<a target="_blank">`, others as React Router `<Link>`.

---

### Phase 3: Catalog & Model Pages
> **Goal:** Replace `mockCars` across Cars Listing and Car Detail pages.

**Step 3.1 — `cars/page.jsx` — Grid data**
```jsx
const { data: models = [], isLoading } = useQuery({
  queryKey: QUERY_KEYS.models,
  queryFn: fetchAllModels,
  placeholderData: FALLBACK_MODELS,   // from src/data/fallbacks/ during transition
});
```

**Step 3.2 — `cars/page.jsx` — Sidebar filter facets**
```jsx
const { data: modelCars = [] } = useQuery({
  queryKey: QUERY_KEYS.modelCars,
  queryFn: fetchModelCars,
});

// Derive filter options from slash-split normalized data
const bodyTypes     = [...new Set(modelCars.flatMap(m => m.bodyTypes))];
const fuelTypes     = [...new Set(modelCars.flatMap(m => m.fuelTypes))];
const transmissions = [...new Set(modelCars.flatMap(m => m.transmissionTypes))];
```

**Step 3.3 — `cars/page.jsx` — Hero carousel**
```jsx
const isMobile = window.innerWidth <= 576;
const { data: banners = {} } = useQuery({
  queryKey: QUERY_KEYS.banners(isMobile),
  queryFn: () => fetchBanners(isMobile),
});
const cityBanners = banners[selectedCity] ?? banners['Bengaluru'] ?? [];
```

**Step 3.4 — `cars/[slug]/page.jsx` — Replace `useKalyani().cars.find()`**
```jsx
const { data: variants = [], isLoading, error } = useQuery({
  queryKey: QUERY_KEYS.carBySlug(slug),
  queryFn: () => fetchCarBySlug(slug),
  enabled: !!slug,
});

const car = variants[0] ?? null;   // first variant carries shared metadata
```

Component field mapping changes:
| Old (mockCars shape) | New (normalizeCarVariant shape) |
|:---|:---|
| `car.heroImage` | `car.images[0]` |
| `car.gallery.exterior` | `car.images` |
| `car.colors[].image` (local import) | `car.colors[].image` (CDN URL) |
| `car.variants[]` | `variants.map(v => v.variant)` |
| `car.brochureUrl` | `car.brochureUrl` (now correctly admin-root prefixed) |
| `car.fuelTypes` | `car.fuelTypes` (array, already split) |

**Step 3.5 — `EnquiryPopupModal.jsx` model dropdown**
```jsx
const { data: allModels = [] } = useQuery({
  queryKey: QUERY_KEYS.allModelList,
  queryFn: fetchAllModelList,
});
// Replace cars.map(...) with allModels.map(m => <SelectItem value={m.name} key={m.id}>)
```

---

### Phase 4: Service & Workshops
> **Goal:** Replace `mockServices` across the Service page.

**Step 4.1 — Hero images** from `fetchServiceBanners()` → `serviceBanners[selectedCity.toLowerCase()] ?? []`

**Step 4.2 — Service categories** from `fetchServices()` → normalized array with CDN image URLs

**Step 4.3 — Seasonal packages** from `fetchSeasonalServices()` → `data[0].services[]`

**Step 4.4 — Workshop video** — render `<iframe>` or `<a>` with `videoUrl` from `fetchServiceVideo()`

**Step 4.5 — Service FAQs** from `fetchServiceFaq()`

**Step 4.6 — Service Booking Form**
```jsx
const mutation = useMutation({
  mutationFn: submitLead,
  onSuccess: (data) => setSuccessInfo(data),
  onError: (err) => setErrorMsg(err.message),
});

// Replace setIsSubmitting(true/false) with mutation.isPending
// In handleSubmit:
mutation.mutate({
  name: bookingForm.fullName,
  phone: bookingForm.phone,
  vehicle: bookingForm.carModel,
  purpose: 'Book Service',
  city: selectedCity,
  location: selectedWorkshop?.address ?? selectedCity,
});
```

---

### Phase 5: Outlets & Contact Pages
> **Goal:** Replace `mockLocations` (currently imported directly in outlets/page.jsx, bypassing context) with live API data.

**Step 5.1 — `outlets/page.jsx`**
```jsx
// DELETE: import { mockLocations } from '../../../data/mockLocations';

const { data: allOutlets = [], isLoading } = useQuery({
  queryKey: QUERY_KEYS.outlets,
  queryFn: fetchOutlets,
});

const cityKey = selectedCity.toLowerCase();
const locationsForCity = allOutlets.filter(
  (o) => o.city.toLowerCase() === cityKey
);
const filteredOutlets = locationsForCity.filter((outlet) => {
  const catMatch = outlet.category.toLowerCase() === currentTabInfo.category;
  const typeMatch = !hasSub || outlet.type === activeSubType;
  return catMatch && typeMatch;
});
```

Replace hardcoded `outlet.mapUrl` with `outlet.mapsUrl` (produced by `normalizeOutlet` via `buildMapsUrl`).

**Step 5.2 — `contact/page.jsx`**
```jsx
// Regional phone numbers
const { data: iconLocations = [] } = useQuery({
  queryKey: QUERY_KEYS.iconLocations,
  queryFn: fetchIconLocations,
});
const cityContact = iconLocations.find(l => l.city === selectedCity);

// FAQs
const { data: faqs = [] } = useQuery({
  queryKey: QUERY_KEYS.commonFaq,
  queryFn: fetchCommonFaq,
});
```

**Step 5.3 — Contact form mutation**
```jsx
const mutation = useMutation({
  mutationFn: submitLead,
  onSuccess: (data) => setSubmissionResult(data),
  onError: (err) => setErrorMsg(err.message),
});
// Replace submitContactEnquiry() call with mutation.mutate({ ... purpose: 'Enquiry' ... })
```

---

### Phase 6: Lead Generation Forms & Popups
> **Goal:** Wire all lead forms to the dual-dispatch `submitLead()` pipeline using `useMutation`.

**Step 6.1 — `EnquiryPopupModal.jsx`**
```jsx
const mutation = useMutation({ mutationFn: submitLead });

// Replace handleSubmit body:
mutation.mutate(
  {
    name: formData.fullName,
    phone: formData.phone,
    vehicle: formData.model,
    purpose: 'Vehicle Purchase Enquiry',
    city: formData.city,
    location: formData.city,
    email: '',
  },
  {
    onSuccess: (data) => {
      setSuccessInfo(data);
      setTimeout(handleClose, 3500);
    },
    onError: () =>
      setErrorMsg('Could not submit enquiry. Please try again or call our helpline.'),
  }
);

// Replace: isSubmitting        → mutation.isPending
// Replace: successInfo check   → mutation.isSuccess
```

**Step 6.2 — `TestDriveModal.jsx`**
```jsx
const mutation = useMutation({ mutationFn: submitLead });

mutation.mutate({
  name: formData.fullName,
  phone: formData.phone,
  email: formData.email,
  vehicle: activeCar?.name,
  purpose: 'Book Test Drive',
  city: selectedCity,
  location: selectedBranch?.address ?? selectedCity,
});
// Replace isSubmitting  → mutation.isPending
// Replace successInfo   → mutation.isSuccess / mutation.data
```

**Step 6.3 — Location field routing logic for Zuqo**
- **If user selected a branch** → use `branch.address` as `location`
- **If no branch selected** → use `selectedCity` as `location`
- The `cityToZuqoRouting()` function in `zuqoClient.js` normalizes both correctly.

**Step 6.4 — `cars/[slug]/page.jsx` On Road Price CTA**
```jsx
const priceMutation = useMutation({ mutationFn: submitLead });

// On CTA click:
priceMutation.mutate({
  name: onRoadForm.name,
  phone: onRoadForm.phone,
  vehicle: car?.name ?? '',
  purpose: 'On Road Price',
  city: selectedCity,
  location: selectedCity,
});
```

---

## 5. Risk Assessment & Fallback Strategy

### 5.1 Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|:---|:---|:---|:---|
| `varientbike` slug mapping fails for an unmapped model | Medium | Medium | Fallback to `slug.replace(/-/g, ' ')`. On 404, show "Model details unavailable" with link back to `/cars`. |
| Zuqo JWT token expiry | High | Medium | `Promise.allSettled` ensures the internal lead still saves. Monitor console warnings. Manual JWT renewal required in `zuqoClient.js`. |
| CORS errors from `demo.zuqodemo.world:4342` | Medium | High | Legacy codebase uses this URL directly from browser. If CORS is blocked, add a cPanel `.htaccess` reverse-proxy path or deploy a minimal CORS proxy. |
| API response shape changes (undocumented backend update) | Low | High | Normalizers use `?? defaultValue` at every field. Components receive empty arrays/strings rather than throwing. |
| `longtitude` typo corrected in a future backend deploy | Low | Low | `normalizeGps` reads `longtitude ?? longitude` — handles both spellings. |
| Outlet GPS coordinates are `null` or `"0"` | Medium | Low | `buildMapsUrl` returns `null` if coordinates are falsy. Components conditionally render the Maps link only when `outlet.mapsUrl` exists. |
| `/api/banner` returns empty for a city | Medium | Medium | Fallback: use `banners['Bengaluru']` if selected city has no banners. |
| Seasonal service endpoint returns empty array | Low | Low | Components guard with `if (!seasonalServices.length) return null`. |

### 5.2 UI Fallback Strategy — No Network Breakage

**Loading States:** Use skeleton components:
```jsx
if (isLoading) return <CarCardSkeleton count={9} />;
```

**Error States with Retry:**
```jsx
if (error) return (
  <FallbackBanner
    message="Could not load car catalog. Please refresh."
    onRetry={() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.models })}
  />
);
```

**Stale Data Resilience:** TanStack Query's `staleTime: 1 hour` serves cached data during temporary network outages — no blank screens on repeat visits within the same session.

**Last-Resort `placeholderData`:** Move existing mock files to `src/data/fallbacks/` and use them as `placeholderData` in critical queries during the transition period. This ensures the UI is never empty while live data loads for the first time:
```javascript
useQuery({
  queryKey: QUERY_KEYS.models,
  queryFn: fetchAllModels,
  placeholderData: FALLBACK_MODELS,  // from src/data/fallbacks/fallbackCars.js
})
```

### 5.3 SEO & cPanel Static Hosting

**SPA Routing Fix — `public/.htaccess`**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```
This rewrites all non-file requests to `index.html`, letting React Router handle the URL. CRA places this file in `build/.htaccess` automatically.

**`package.json` `homepage: "."`** — Already correctly set for relative asset paths on cPanel.

**Per-Page Meta Tags — `react-helmet-async`**
```bash
npm install react-helmet-async
```
Wrap `src/index.js` with `<HelmetProvider>`. Each page sets:
```jsx
<Helmet>
  <title>Fronx | Kalyani Motors — Maruti Suzuki Bengaluru</title>
  <meta name="description" content="Explore the Fronx Turbo Coupe SUV at Kalyani Motors. Book test drive online." />
  <link rel="canonical" href={`https://kalyanimotors.com/cars/${slug}`} />
</Helmet>
```

**Sitemap:** The existing `src/kalyaniUrls.js` + `src/SiteMapGenerator.js` already exist. Generate and commit `public/sitemap.xml` as part of the pre-build step. Upload to cPanel root.

### 5.4 JWT Security Acknowledgement

> **Known Issue (Cannot Fix Without Backend Change)**
>
> The Zuqo CRM JWT token is exposed in client-side JavaScript — inherited from the legacy codebase. This is acceptable only because:
> 1. The deployment constraint (cPanel static hosting) rules out server-side proxying.
> 2. The JWT was already publicly exposed in the legacy codebase.
>
> **Recommended future fix:** Deploy a minimal proxy (Railway/Render free tier) that holds the JWT server-side and exposes a single `POST /crm-lead` endpoint. Replace `zuqoClient.js` direct calls with calls to this proxy. Add rate-limiting and reCAPTCHA on the proxy.

---

## Appendix: Mock File → Live Endpoint Quick Reference

| Mock File | Replaced By (function) | Target Endpoint(s) |
|:---|:---|:---|
| `src/data/mockCars.js` | `fetchAllModels()` + `fetchCarBySlug(slug)` | `/api/model`, `/api/varientbike?name=` |
| `src/data/mockBanners.js` | `fetchBanners(isMobile)` | `/api/banner`, `/api/mobilebanner` |
| `src/data/mockLocations.js` | `fetchOutlets()` + `fetchIconLocations()` | `/api/location`, `/api/iconlocation` |
| `src/data/mockServices.js` | `fetchServices()` + `fetchServiceBanners()` | `/api/service`, `/api/servicebanner` |
| `src/data/mockFaqs.js` | `fetchCommonFaq()` / `fetchServiceFaq()` | `/api/commonfaq`, `/api/servicefaq` |
| `kalyaniApi.submitContactEnquiry()` | `submitLead()` from `zuqoClient.js` | `POST /api/enquiry` + Zuqo 2-step |
| `kalyaniApi.submitTestDrive()` | `submitLead()` from `zuqoClient.js` | `POST /api/enquiry` + Zuqo 2-step |
| `kalyaniApi.submitServiceBooking()` | `submitLead()` from `zuqoClient.js` | `POST /api/enquiry` + Zuqo 2-step |
