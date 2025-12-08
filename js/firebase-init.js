// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

// Firebase Auth
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Firestore
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Storage
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTUMjsg5uIlJrs3NDsF1iiGYZ_iJT5Vec",
  authDomain: "financetracker-e5650.firebaseapp.com",
  projectId: "financetracker-e5650",
  storageBucket: "financetracker-e5650.appspot.com",
  messagingSenderId: "475408463794",
  appId: "1:475408463794:web:dbbbda33274fa0e51c16ab"
};

// Init Firebase
export const app = initializeApp(firebaseConfig);

// Init Authentication
export const auth = getAuth(app);

// Init Firestore
export const db = getFirestore(app);

// Init Storage
export const storage = getStorage(app);

// Export Firestore + Storage helper functions
export {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  ref,
  uploadBytes,
  getDownloadURL
};

console.log("Firebase Initialized:", app.name);
