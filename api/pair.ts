// src/api/pair.ts

import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL_API;
console.log("BASE_URL_API =", BASE_URL);


const API_ENTRYPOINT_PREFIX = '/apiEntrypoint';  

export async function pairDevice(
  device_id: string,
  email: string,
  token?: string
): Promise<any> {
  try {
    console.log("🔗 Pairing device:", device_id, "for email:", email);

    // PATCH: use /apiEntrypoint prefix here:
    const fullURL = `${BASE_URL}${API_ENTRYPOINT_PREFIX}/pair-device`;
    console.log("🌐 POST URL:", fullURL);

    const response = await fetch(fullURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        device_id,
        email,
      }),
    });

    console.log("📡 pairDevice response status:", response.status);

    if (!response.ok) {
      let error = {};
      try {
        error = await response.json();
      } catch {
        console.error("❌ pairDevice() response not JSON");
      }

      console.error("❌ pairDevice() response error:", response.status, error);
      throw new Error((error as any)?.detail || "Failed to pair device.");
    }

    const result = await response.json();
    console.log("✅ Device paired:", result);
    return result;
  } catch (error: any) {
    console.error("❌ Error in pairDevice():", error);

    if (error instanceof Error) {
      console.error("❌ Error message:", error.message);
    } else {
      console.error("❌ Full error object:", JSON.stringify(error, null, 2));
    }

    throw error;
  }
}
