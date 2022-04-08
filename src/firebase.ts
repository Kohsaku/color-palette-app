import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInAnonymously } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA4-B4laeUHbkZGWVKXLvKEo71p1S-rtAI",
  authDomain: "color-palette-app-c87dd.firebaseapp.com",
  projectId: "color-palette-app-c87dd",
  storageBucket: "color-palette-app-c87dd.appspot.com",
  messagingSenderId: "394973645287",
  appId: "1:394973645287:web:c265c0d05387acb7bc9542",
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth();
export const storage = getStorage(firebaseApp);
export const provider = new GoogleAuthProvider();
