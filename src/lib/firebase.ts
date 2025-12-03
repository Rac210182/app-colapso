import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQcK3cdN8z7_kfvaofn3cmMnORAZpGCP0",
  authDomain: "colapso-b4b77.firebaseapp.com",
  projectId: "colapso-b4b77",
  storageBucket: "colapso-b4b77.firebasestorage.app",
  messagingSenderId: "313886063378",
  appId: "1:313886063378:web:8a55bbf39a4099537551cb"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
