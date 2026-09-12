/**
 * Native Fetch API client wrapper
 * Zero Axios dependencies - pure modern browser fetch
 */

const BASE_URL = 'https://kalyanimotorsapi.kalyanimotors.com/api/';

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
      throw new Error(`HTTP ${res.status}: ${res.statusText} ${errorBody}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`[API Error] Request failed for ${endpoint}:`, err);
    throw err;
  }
}
