import Constants from 'expo-constants';

const firebaseConfig = Constants.expoConfig?.extra?.firebase;

if (!firebaseConfig) {
  throw new Error('Missing Firebase config in app.config.js > extra.firebase');
}
