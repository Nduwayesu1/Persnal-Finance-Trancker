import {
  db,
  storage,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  ref,
  uploadBytes,
  getDownloadURL
} from "./firebase-init.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addTransactionBtn");
  const modal = document.getElementById("transactionModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const expenseTab = document.getElementById("expenseTab");
  const incomeTab = document.getElementById("incomeTab");

  const amountInput = document.getElementById("amountInput");
  const categoryInput = document.getElementById("categoryInput");
  const dateInput = document.getElementById("dateInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const receiptInput = document.getElementById("receiptInput");
  const uploadBtn = document.getElementById("uploadBtn");

  const form = document.getElementById("transactionForm");
  const transactionList = document.getElementById("transactionList");

  let transactionType = "expense";
  let transactionsRef;
  let editTransactionId = null;


  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Authenticated:", user.uid);
      transactionsRef = collection(db, "users", user.uid, "transactions");
      loadTransactions();
    } else {
      window.location.href = "/index.html";
    }
  });


  function openModal() {
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
    form.reset();
    editTransactionId = null;
    transactionType = "expense";
    expenseTab.classList.add("active");
    incomeTab.classList.remove("active");
  }

  addBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });


  expenseTab.addEventListener("click", () => {
    transactionType = "expense";
    expenseTab.classList.add("active");
    incomeTab.classList.remove("active");
  });

  incomeTab.addEventListener("click", () => {
    transactionType = "income";
    incomeTab.classList.add("active");
    expenseTab.classList.remove("active");
  });

  uploadBtn.addEventListener("click", () => receiptInput.click());

  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (!auth.currentUser) return alert("You must be signed in!");

    try {
      let receiptURL = null;

      // Upload image if exists
      if (receiptInput.files.length > 0) {
        const file = receiptInput.files[0];
        const fileRef = ref(storage, `receipts/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        receiptURL = await getDownloadURL(fileRef);
      }

      const transactionData = {
        type: transactionType,
        amount: parseFloat(amountInput.value),
        category: categoryInput.value,
        date: dateInput.value,
        description: descriptionInput.value,
        receipt: receiptURL,
        createdAt: Date.now()
      };

      if (editTransactionId) {
        await updateDoc(doc(transactionsRef, editTransactionId), transactionData);
        alert("Transaction updated successfully!");
        editTransactionId = null;
      } else {
        await addDoc(transactionsRef, transactionData);
        alert("Transaction saved successfully!");
      }

      closeModal();
      loadTransactions();

    } catch (err) {
      console.error(err);
      alert(" Failed to save transaction");
    }
  });


  async function loadTransactions() {
    if (!transactionsRef) return;

    transactionList.innerHTML = "";

    try {
      const snapshot = await getDocs(transactionsRef);

      if (snapshot.empty) {
        transactionList.innerHTML = `<p class="no-data">No transactions found.</p>`;
        return;
      }

      snapshot.forEach(docSnap =>
        renderTransaction(docSnap.id, docSnap.data())
      );

    } catch (err) {
      console.error(err);
      alert(" Failed to load transactions");
    }
  }

  
  function renderTransaction(id, t) {
    const li = document.createElement("li");
    li.className = `transaction-item ${t.type}`;

    li.innerHTML = `
      <div class="transaction-info">
        <div class="transaction-title">${t.description}</div>
        <div class="transaction-meta">${t.category} • ${t.date}</div>
      </div>

      <div class="transaction-amount ${t.type}">
        ${t.type === "income" ? "+" : "-"}$${t.amount.toFixed(2)}
      </div>

      <div class="transaction-actions">
        ${t.receipt ? `<a href="${t.receipt}" target="_blank" class="receipt-link"><img src="/image/receipt.png" /></a>` : ""}
        <button class="edit-btn" data-id="${id}"><img src="/image/edit.png" /></button>
        <button class="delete-btn" data-id="${id}"><img src="/image/delete.png" /></button>
      </div>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => deleteTransaction(id));
    li.querySelector(".edit-btn").addEventListener("click", () => openEditModal(id, t));

    transactionList.appendChild(li);
  }


  async function deleteTransaction(id) {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await deleteDoc(doc(transactionsRef, id));
      alert("Transaction deleted!");
      loadTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction");
    }
  }


  function openEditModal(id, t) {
    editTransactionId = id;
    transactionType = t.type;

    if (t.type === "expense") {
      expenseTab.classList.add("active");
      incomeTab.classList.remove("active");
    } else {
      incomeTab.classList.add("active");
      expenseTab.classList.remove("active");
    }

    amountInput.value = t.amount;
    categoryInput.value = t.category;
    dateInput.value = t.date;
    descriptionInput.value = t.description;

    openModal();
  }

  console.log("Transactions Module Loaded");
});
