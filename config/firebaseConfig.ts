import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import { getAuth, Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
 
// 🔥 Get Firebase config from app.config.js > extra.firebase
const firebaseConfig = Constants.expoConfig?.extra?.firebase;
if (!firebaseConfig) {
  throw new Error(
    "Missing Firebase config in app.config.js > extra.firebase"
  );
}
 
let app: FirebaseApp;
let auth: Auth;
 
// Initialize or retrieve Firebase app & auth
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}
 
// Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);
 
export { app, auth, db, storage };