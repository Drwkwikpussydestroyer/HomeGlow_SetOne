// src/api/controlLight.ts

import Constants from 'expo-constants';

/**
 * Call the Light Control API to toggle a light ON or OFF
 */

// Read BASE_URL from app.config.js extra field
const BASE_URL = Constants.expoConfig?.extra?.BASE_URL_API;
console.log("🌐 BASE_URL_API =", BASE_URL);

export async function controlLight(
  status: "ON" | "OFF",
  light_id: string = "default",
  token?: string
): Promise<any> {
  try {
    console.log("⚡ Sending controlLight request:", {
      status,
      light_id,
      token: token ? "Bearer <hidden>" : "None",
    });

    const response = await fetch(`${BASE_URL}/light/control`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status, light_id }),
    });

    console.log("📡 controlLight response status:", response.status);

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (jsonError) {
        errorBody = { error: "Failed to parse error response as JSON." };
      }

      console.error("❌ controlLight() response error:", response.status, errorBody);

      throw new Error(
        errorBody?.detail || `Light control failed. HTTP ${response.status}`
      );
    }

    const result = await response.json();
    console.log("✅ Light control successful:", result);
    return result;
  } catch (error: any) {
    console.error("❌ Error in controlLight():", error);

    if (error instanceof Error) {
      console.error("❌ Error message:", error.message);
    } else {
      console.error("❌ Full error object:", JSON.stringify(error, null, 2));
    }

    throw error;
  }
}
