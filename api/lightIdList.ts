import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL_API;
console.log('🌐 BASE_URL_API =', BASE_URL);

/**
 * GET /light/list
 */
export async function getLightList(token?: string): Promise<string[]> {
  const fullURL = `${BASE_URL}/apiEntrypoint/light/list`;

  const response = await fetch(fullURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    let errorDetail = 'Failed to fetch light list.';
    try {
      const error = await response.json();
      errorDetail = error?.detail || errorDetail;
    } catch (e) {
      // ignore JSON parse error
    }
    throw new Error(errorDetail);
  }

  const result = await response.json();
  return result.lights || [];
}
