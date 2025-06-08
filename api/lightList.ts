// src/api/lightList.ts

import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL_API;
console.log('🌐 BASE_URL_API =', BASE_URL);

/**
 * GET /light/status
 */
export async function getLightStatus(
  light_ids?: string[],
  token?: string
): Promise<any> {
  try {
    console.log('Fetching light status');
    console.log('light_ids param:', light_ids);

    // Guard: token required
    if (!token) {
      throw new Error('Auth token is required');
    }

    // Build URL params
    const params = new URLSearchParams();

    if (light_ids && light_ids.length > 0) {
      light_ids.forEach((id) => params.append('light_ids', id));
    }

    const fullURL = `${BASE_URL}/light/status?${params.toString()}`;
    console.log('GET URL:', fullURL);

    // Make API call
    const response = await fetch(fullURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('getLightStatus response status:', response.status);

    // Handle error
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ getLightStatus() response error:', response.status, error);
      throw new Error(error?.detail || 'Failed to fetch light status.');
    }

    // Success
    const result = await response.json();
    console.log('✅ Light status fetched:', result);
    return result;
  } catch (error: any) {
    console.error('Error in getLightStatus():', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
    } else {
      console.error('Full error object:', JSON.stringify(error, null, 2));
    }

    throw error;
  }
}
