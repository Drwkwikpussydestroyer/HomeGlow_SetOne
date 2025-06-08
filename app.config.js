import 'dotenv/config';

export default {
  expo: {
    name: 'HomeGlow',
    slug: 'homeglow',
    extra: {
      firebase: {
        apiKey: process.env.API_KEY,
        authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
        databaseURL: process.env.FIREBASE_URL,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.PROJECT_NUMBER,
        appId: process.env.MOBILESDK_APP_ID,
      },
      BASE_URL_API: process.env.BASE_URL_API,
    },
  },
};
