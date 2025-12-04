import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const messageBox = document.getElementById("messageBox");

function showMessage(type, text) {
  messageBox.classList.remove("hidden", "success", "error");
  messageBox.classList.add(type);
  messageBox.textContent = text;
  messageBox.style.display = "block";
  setTimeout(() => {
    messageBox.style.display = "none";
  }, 4000);
}

/* ---------------- SIGN UP ---------------- */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Set displayName if user entered fullName
      if (fullName) {
        await updateProfile(userCredential.user, { displayName: fullName });
      }

      console.log("Account Created:", userCredential.user);
      showMessage("success", "Account created successfully!");

      signupForm.reset();

    } catch (error) {
      console.error(error);
      showMessage("error", error.message);
    }
  });
}

/* ---------------- SIGN IN ---------------- */
const signinForm = document.getElementById("signinForm");
if (signinForm) {
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", userCredential.user);
      showMessage("success", "Login successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/Dashboard.html";
      }, 1200);

    } catch (error) {
      console.error(error);
      showMessage("error", error.message);
    }
  });
}

/* ---------------- GOOGLE SIGN-IN ---------------- */
const googleBtn = document.querySelector(".google-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("Google Login:", result.user);
      showMessage("success", "Login successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/Dashboard.html";
      }, 1200);

    } catch (error) {
      console.error(error);
      showMessage("error", error.message);
    }
  });
}
