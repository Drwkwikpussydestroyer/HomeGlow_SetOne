// src/api/notificationSettings.ts

import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL_API;
console.log("BASE_URL_API =", BASE_URL);

const API_ENTRYPOINT_PREFIX = '/apiEntrypoint';  // match your existing setup

/**
 * Fetch the user's notification settings (notify_duration)
 * @param {string} token - Firebase Auth ID token (optional but should be present)
 * @returns {Promise<number>} notify_duration in seconds
 */
export async function fetchNotificationSettings(token?: string): Promise<number> {
  try {
    console.log("🔍 Fetching notification settings");

    const fullURL = `${BASE_URL}${API_ENTRYPOINT_PREFIX}/notification-settings`;
    console.log("🌐 GET URL:", fullURL);

    const response = await fetch(fullURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log("📡 fetchNotificationSettings response status:", response.status);

    if (!response.ok) {
      let error = {};
      try {
        error = await response.json();
      } catch {
        console.error("❌ fetchNotificationSettings() response not JSON");
      }

      console.error("❌ fetchNotificationSettings() response error:", response.status, error);
      throw new Error((error as any)?.detail || "Failed to fetch notification settings.");
    }

    const result = await response.json();
    console.log("✅ Notification settings fetched:", result);

    return result.notify_duration;
  } catch (error: any) {
    console.error("❌ Error in fetchNotificationSettings():", error);

    if (error instanceof Error) {
      console.error("❌ Error message:", error.message);
    } else {
      console.error("❌ Full error object:", JSON.stringify(error, null, 2));
    }

    throw error;
  }
}

/**
 * Update the user's notification settings (notify_duration)
 * @param {number} notifyDuration - New notify_duration in seconds
 * @param {string} token - Firebase Auth ID token (optional but should be present)
 * @returns {Promise<number>} updated notify_duration
 */
export async function updateNotificationSettings(notifyDuration: number, token?: string): Promise<number> {
  try {
    console.log("📝 Updating notification settings to:", notifyDuration, "seconds");

    const fullURL = `${BASE_URL}${API_ENTRYPOINT_PREFIX}/notification-settings`;
    console.log("🌐 PUT URL:", fullURL);

    const response = await fetch(fullURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        notify_duration: notifyDuration,
      }),
    });

    console.log("📡 updateNotificationSettings response status:", response.status);

    if (!response.ok) {
      let error = {};
      try {
        error = await response.json();
      } catch {
        console.error("❌ updateNotificationSettings() response not JSON");
      }

      console.error("❌ updateNotificationSettings() response error:", response.status, error);
      throw new Error((error as any)?.detail || "Failed to update notification settings.");
    }

    const result = await response.json();
    console.log("✅ Notification settings updated:", result);

    return result.notify_duration;
  } catch (error: any) {
    console.error("❌ Error in updateNotificationSettings():", error);

    if (error instanceof Error) {
      console.error("❌ Error message:", error.message);
    } else {
      console.error("❌ Full error object:", JSON.stringify(error, null, 2));
    }

    throw error;
  }
}
