import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDI0_Cr4lpNElC1nzwZOqKJrxzLH1MmP9c",
  authDomain: "hospitalsystem-1adee.firebaseapp.com",
  projectId: "hospitalsystem-1adee",
  storageBucket: "hospitalsystem-1adee.firebasestorage.app",
  messagingSenderId: "276852668959",
  appId: "1:276852668959:web:a2497be30b0f96dafa732a",
  measurementId: "G-2KLDSMEFF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
