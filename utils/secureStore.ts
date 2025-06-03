import * as SecureStore from 'expo-secure-store';

export enum TokenKey {
  FirebaseID = 'firebase_id_token',
  User = 'user_info',
}

// Save token wrapper
export async function saveToken(key: TokenKey, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.error('[secureStore] ❌ Failed to save token:', e);
    throw e;
  }
}

// Get token wrapper
export async function getToken(key: TokenKey): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(key);
    return token;
  } catch (e) {
    console.error('[secureStore] ❌ Failed to get token:', e);
    throw e;
  }
}

// Delete token wrapper
export async function deleteToken(key: TokenKey): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.error('[secureStore] ❌ Failed to delete token:', e);
    throw e;
  }
}
