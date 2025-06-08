  // src/api/schedule.ts

  import Constants from 'expo-constants';

  const BASE_URL = Constants.expoConfig?.extra?.BASE_URL_API;
  console.log("BASE_URL_API =", BASE_URL);

  const API_ENTRYPOINT_PREFIX = '/apiEntrypoint/light';


  export async function updateLightSchedule(
    params: {
      wake_up?: string;
      sleep?: string;
      wake_up_light_id?: string;
      sleep_light_id?: string;
    },
    token: string
  ): Promise<any> {
    const BASE_URL = Constants.expoConfig?.extra?.BASE_URL_API;
    const fullURL = `${BASE_URL}${API_ENTRYPOINT_PREFIX}/schedule`;

    const response = await fetch(fullURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params), // Use body instead of URL params
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.detail || "Failed to update schedule.");
    }

    return await response.json();
  }

  /**
   * Fetch light schedule
   */
  export async function fetchLightSchedule(token?: string): Promise<any> {
    try {
      const fullURL = `${BASE_URL}${API_ENTRYPOINT_PREFIX}/schedule`;
      console.log("🌐 GET URL:", fullURL);

      const response = await fetch(fullURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      console.log("📡 fetchLightSchedule response status:", response.status);

      if (!response.ok) {
        let error = {};
        try {
          error = await response.json();
        } catch {
          console.error("❌ fetchLightSchedule() response not JSON");
        }

        console.error("❌ fetchLightSchedule() response error:", response.status, error);
        throw new Error((error as any)?.detail || "Failed to fetch schedule.");
      }

      const result = await response.json();
      console.log("✅ Schedule fetched:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Error in fetchLightSchedule():", error);

      if (error instanceof Error) {
        console.error("❌ Error message:", error.message);
      } else {
        console.error("❌ Full error object:", JSON.stringify(error, null, 2));
      }

      throw error;
    }
  }
