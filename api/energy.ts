import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL_API;
console.log("BASE_URL_API =", BASE_URL);

export async function getLightEnergy(
  email: string,
  token?: string
): Promise<any> {
  try {
    console.log("Fetching light energy for email:", email);

    const params = new URLSearchParams();
    params.append("email", email);

    // For now, DO NOT send light_ids because backend doesn't support it yet
    // If you add support later, you can add it here again

    const fullURL = `${BASE_URL}/energy-data?${params.toString()}`;
    console.log("🌐 GET URL:", fullURL);

    const response = await fetch(fullURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log("📡 getLightEnergy response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ getLightEnergy() response error:", response.status, error);
      throw new Error(error?.detail || "Failed to fetch light energy.");
    }

    const result = await response.json();
    console.log("✅ Light energy fetched:", result);
    return result;
  } catch (error: any) {
    console.error("❌ Error in getLightEnergy():", error);

    if (error instanceof Error) {
      console.error("❌ Error message:", error.message);
    } else {
      console.error("❌ Full error object:", JSON.stringify(error, null, 2));
    }

    throw error;
  }
}
