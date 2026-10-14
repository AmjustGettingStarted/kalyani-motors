/**
 * Native Fetch API client wrapper
 * Zero Axios dependencies - pure modern browser fetch
 */

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://kalyanimotorsapi.kalyanimotors.com/api/';
export const STORAGE_CDN = process.env.REACT_APP_STORAGE_CDN || 'https://kalyanimotorsadmin.kalyanimotors.com/storage/';
export const ADMIN_ROOT = process.env.REACT_APP_ADMIN_ROOT || 'https://kalyanimotorsadmin.kalyanimotors.com/';
const ZUQO_BASE = process.env.REACT_APP_ZUQO_BASE_URL || 'https://demo.zuqodemo.world:4342/';

export async function apiClient(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      if (cleanEndpoint === 'enquiry' && (errorBody.includes('TransportException') || errorBody.includes('Connection could not be established with host'))) {
        console.warn('[API Warning] Enquiry accepted but backend email dispatch failed:', errorBody.slice(0, 200));
        return { success: true, message: 'Enquiry received successfully' };
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText} ${errorBody}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`[API Error] Request failed for ${endpoint}:`, err);
    throw err;
  }
}

/**
 * Separate client for Zuqo CRM (different base URL + auth header)
 */
export async function zuqoClient(path, body) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const url = `${ZUQO_BASE}${cleanPath}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // NOTE: This JWT is long-lived and public in the legacy codebase.
      'Authorization': 'Axi12#$ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNjY2MTJiYWU4MjkwZjZiNWI2ZjAwOTk5IiwiaWF0IjoxNzQyMTg0Mjc2LCJleHAiOjE3NzM3MjAyNzZ9.Z-rMS2RklsawdXAZNHYQ3x6BiRB_AdkCeMbRyWIZPm0',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`Zuqo HTTP ${res.status}: ${res.statusText} ${errorBody}`);
  }
  return res.json();
}
