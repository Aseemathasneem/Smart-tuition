// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smart-tuition-15d16.firebaseapp.com",
  projectId: "smart-tuition-15d16",
  storageBucket: "smart-tuition-15d16.appspot.com",
  messagingSenderId: "477609589359",
  appId: "1:477609589359:web:5e176a056792c105a52b9a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);