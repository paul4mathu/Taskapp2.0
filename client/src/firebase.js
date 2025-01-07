import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCp9AiUgF_Vdr5Eyulz8LPuQkQXy7kFGus",
  authDomain: "taskapp-8d9c8.firebaseapp.com",
  projectId: "taskapp-8d9c8",
  storageBucket: "taskapp-8d9c8.firebasestorage.app",
  messagingSenderId: "757562084436",
  appId: "1:757562084436:web:5b858ffa7e552416c771c1",
  measurementId: "G-V5WJSJWSDV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore export
export default app;
