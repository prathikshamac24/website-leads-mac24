import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCyg4IMeVSAX0ac8eKwdqK_oclCrx3jOcw",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "website-leads-mac24.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "website-leads-mac24",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "website-leads-mac24.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "7863101051",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:7863101051:web:bf06d62ce9086fc47b64de",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-1YQT2K4QMF"
};

// Initialize Firebase App (prevent duplicate initialization in hot-reloading/SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firestore database reference
export const db = getFirestore(app);

// Initialize Analytics safely only in browser environments
export let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}