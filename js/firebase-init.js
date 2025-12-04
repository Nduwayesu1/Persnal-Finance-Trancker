import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTUMjsg5uIlJrs3NDsF1iiGYZ_iJT5Vec",
  authDomain: "financetracker-e5650.firebaseapp.com",
  projectId: "financetracker-e5650",
  storageBucket: "financetracker-e5650.firebasestorage.app",
  messagingSenderId: "475408463794",
  appId: "1:475408463794:web:dbbbda33274fa0e51c16ab"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

console.log("Firebase Initialized:", app.name);
