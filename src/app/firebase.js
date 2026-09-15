import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase Console se copy ki hui keys se in details ko replace karein
const firebaseConfig = {
  apiKey: "barber-app-123",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "barber-app-123",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);