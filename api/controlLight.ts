// src/api/controlLight.ts

/**
 * Call the Light Control API to toggle a light ON or OFF
 */

const BASE_URL = process.env.BASE_URL_API

export async function controlLight(
  email: string,
  status: "ON" | "OFF",
  light_id: string = "default"
): Promise<any> {
  try {
    const response = await fetch(
      `${BASE_URL}/light/control`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, status, light_id }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.detail || "Light control failed.");
    }

    const result = await response.json();
    console.log("✅ Light control successful:", result);
    return result;
  } catch (error: any) {
    console.error("❌ Error in controlLight():", error.message);
    throw error;
  }
}