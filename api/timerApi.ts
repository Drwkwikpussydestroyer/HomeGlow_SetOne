// src/api/timerApi.ts

import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL_API;
console.log('🌐 BASE_URL_API =', BASE_URL);

/**
 * GET /timer
 */
export async function getLightTimeout(token?: string): Promise<any> {
  const fullURL = `${BASE_URL}/timer`;
  console.log('🌐 GET URL:', fullURL);

  const response = await fetch(fullURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ getLightTimeout() response error:', response.status, error);
    throw new Error(error?.detail || 'Failed to fetch light timeout.');
  }

  const result = await response.json();
  console.log('✅ Light timeout fetched:', result);
  return result;
}


export async function setLightTimeout(
  hours: number,
  minutes: number,
  seconds: number,
  token?: string
): Promise<any> {
  const fullURL = `${BASE_URL}/timer`;
  console.log('🌐 PUT URL:', fullURL);

  const body = {
    hours,
    minutes,
    seconds,
  };

  const response = await fetch(fullURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('setLightTimeout() response error:', response.status, error);
    throw new Error(error?.detail || 'Failed to set light timeout.');
  }

  const result = await response.json();
  console.log(' Light timeout set:', result);
  return result;
}

export async function toggleAutoTimeout(enabled: boolean, token?: string): Promise<any> {
  const fullURL = `${BASE_URL}/auto-timeout`;
  console.log(' PUT URL:', fullURL);

  const body = {
    auto_timeout_enabled: enabled,
  };

  const response = await fetch(fullURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ toggleAutoTimeout() response error:', response.status, error);
    throw new Error(error?.detail || 'Failed to toggle auto-timeout.');
  }

  const result = await response.json();
  console.log('✅ Auto-timeout toggled:', result);
  return result;
}

/**
 * GET /timer_status
 */
export async function getAutoTimeoutStatus(token?: string): Promise<any> {
  const fullURL = `${BASE_URL}/timer_status`;
  console.log('🌐 GET URL:', fullURL);

  const response = await fetch(fullURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ getAutoTimeoutStatus() response error:', response.status, error);
    throw new Error(error?.detail || 'Failed to fetch auto-timeout status.');
  }

  const result = await response.json();
  console.log('✅ Auto-timeout status fetched:', result);
  return result;
}
