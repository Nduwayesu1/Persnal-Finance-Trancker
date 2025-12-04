import { auth, signOut } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  /* --------------------------- */
  /* AUTH & USER NAME DISPLAY    */
  /* --------------------------- */
  const userNameSpan = document.getElementById("userName");
  const signOutBtn = document.getElementById("signOutBtn");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userNameSpan.textContent = user.email;
    } else {
      window.location.href = "/index.html";
    }
  });

  if (signOutBtn) {
    signOutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "/index.html";
    });
  }

  /* --------------------------- */
  /* SIDEBAR MOBILE CONTROLS     */
  /* --------------------------- */
  const openSidebarBtn = document.getElementById("openSidebarBtn");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");
  const sidebar = document.querySelector(".sidebar");

  openSidebarBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
  });

  closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });

  // Close sidebar when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !openSidebarBtn.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    }
  });

  /* --------------------------- */
  /* TRANSACTIONS LOGIC          */
  /* --------------------------- */

  const categories = ["Food", "Transport", "Utilities", "Entertainment"];
  const transactions = [];

  const categoryFilter = document.getElementById("categoryFilter");
  const transactionCategory = document.getElementById("transactionCategory");
  const transactionList = document.getElementById("transactionList");
  const transactionForm = document.getElementById("transactionForm");
  const transactionModal = document.getElementById("transactionModal");
  const addTransactionBtn = document.getElementById("addTransactionBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  // Fill category dropdown
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.toLowerCase();
    option.textContent = cat;
    transactionCategory.appendChild(option);
  });

  function renderTransactions(list) {
    transactionList.innerHTML = "";
    list.forEach((t) => {
      const li = document.createElement("li");
      li.className = "transaction-item";
      li.dataset.category = t.category;

      li.innerHTML = `
        <div class="transaction-details">
          <div class="transaction-title">${t.title}</div>
          <div class="transaction-category">${t.category}</div>
        </div>
        <div class="transaction-meta">
          <div class="transaction-amount ${t.amount >= 0 ? "amount-positive" : "amount-negative"}">
            $${t.amount.toFixed(2)}
          </div>
          <div class="transaction-date">${t.date}</div>
        </div>
      `;
      transactionList.appendChild(li);
    });
  }

  function highlightTransactions() {
    const selected = categoryFilter.value;
    document.querySelectorAll(".transaction-item").forEach((item) => {
      item.style.opacity = item.dataset.category === selected || selected === "all" ? "1" : "0.3";
    });
  }

  categoryFilter.addEventListener("change", highlightTransactions);

  addTransactionBtn.addEventListener("click", () => {
    transactionModal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    transactionForm.reset();
    transactionModal.classList.add("hidden");
  });

  // Add new transaction
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTransaction = {
      title: document.getElementById("transactionTitle").value,
      category: document.getElementById("transactionCategory").value,
      amount: parseFloat(document.getElementById("transactionAmount").value),
      date: document.getElementById("transactionDate").value,
    };

    transactions.push(newTransaction);
    renderTransactions(transactions);
    highlightTransactions();

    transactionForm.reset();
    transactionModal.classList.add("hidden");
  });

});
