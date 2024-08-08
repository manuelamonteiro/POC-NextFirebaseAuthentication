// /initAuth.ts
import { init } from 'next-firebase-auth';
import { initializeFirebase } from './firebaseConfig';

const initAuth = () => {
  initializeFirebase();
  init({
    authPageURL: '/auth/login',
    appPageURL: '/dashboard',
    loginAPIEndpoint: '/api/auth/login',
    logoutAPIEndpoint: '/api/auth/logout',
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      databaseURL: process.env.FIREBASE_DATABASE_URL!,
    },
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    },
    cookies: {
      name: 'Next Firebase Auth',
      keys: [process.env.COOKIE_SECRET_CURRENT!, process.env.COOKIE_SECRET_PREVIOUS!],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000,
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
      signed: true,
    },
  });
}

export default initAuth;
