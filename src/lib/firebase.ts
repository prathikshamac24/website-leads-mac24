import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBILSaCD2a-x7AEG9oE-AADUNrT4zgMtmw",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "website-leads-460af.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "website-leads-460af",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "website-leads-460af.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "979978301465",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:979978301465:web:93eb984c91f7bf08faba88",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-C3L34HVQT7"
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