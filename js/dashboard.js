import { auth, signOut } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // ---------- USER AUTH ----------
  const userNameSpan = document.getElementById("userName");
  const signOutBtn = document.getElementById("signOutBtn");

  // Show email of logged-in user
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userNameSpan.textContent = user.email; // ONLY email
    } else {
      window.location.href = "/index.html"; // Redirect if not logged in
    }
  });

  // Logout
  if (signOutBtn) {
    signOutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "/index.html";
      } catch (err) {
        console.error("Sign out error:", err);
      }
    });
  }

  // ---------- TRANSACTIONS ----------
  const categories = ["Food", "Transport", "Utilities", "Entertainment"];
  const transactions = [];

  const categoryFilter = document.getElementById("categoryFilter");
  const transactionCategory = document.getElementById("transactionCategory");
  const transactionList = document.getElementById("transactionList");
  const transactionForm = document.getElementById("transactionForm");
  const transactionModal = document.getElementById("transactionModal");
  const addTransactionBtn = document.getElementById("addTransactionBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  // Populate category dropdown
  categories.forEach(cat => {
    const optionForm = document.createElement("option");
    optionForm.value = cat.toLowerCase();
    optionForm.textContent = cat;
    transactionCategory.appendChild(optionForm);
  });

  // Render transactions
  function renderTransactions(list) {
    transactionList.innerHTML = "";
    list.forEach((t) => {
      const li = document.createElement("li");
      li.dataset.category = t.category;
      li.innerHTML = `
        <div class="transaction-details">
          <div class="transaction-title">${t.title}</div>
          <div class="transaction-category">${t.category.charAt(0).toUpperCase() + t.category.slice(1)}</div>
        </div>
        <div class="transaction-meta">
          <div class="transaction-amount ${t.amount >= 0 ? "amount-positive" : "amount-negative"}">$${t.amount.toFixed(2)}</div>
          <div class="transaction-date">${t.date}</div>
        </div>
      `;
      transactionList.appendChild(li);
    });
  }

  // Filter transactions
  function highlightTransactions() {
    const selectedCategory = categoryFilter.value;
    document.querySelectorAll("#transactionList li").forEach(item => {
      if (selectedCategory === "all" || item.dataset.category === selectedCategory) {
        item.style.opacity = "1";
        item.style.fontWeight = "bold";
      } else {
        item.style.opacity = "0.3";
        item.style.fontWeight = "normal";
      }
    });
  }

  categoryFilter.addEventListener("change", highlightTransactions);

  // Modal controls
  addTransactionBtn.addEventListener("click", () => transactionModal.classList.remove("hidden"));
  cancelBtn.addEventListener("click", () => {
    transactionForm.reset();
    transactionModal.classList.add("hidden");
  });

  // Add transaction
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTransaction = {
      title: document.getElementById("transactionTitle").value,
      category: document.getElementById("transactionCategory").value,
      amount: parseFloat(document.getElementById("transactionAmount").value),
      date: document.getElementById("transactionDate").value
    };
    transactions.push(newTransaction);
    renderTransactions(transactions);
    highlightTransactions();
    transactionForm.reset();
    transactionModal.classList.add("hidden");
  });
});
