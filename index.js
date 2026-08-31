/* =========================================================
   FINTRACK PRO
   LOCAL STORAGE VERSION
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const ctx = document.getElementById("cashFlowChart");

const addBtn = document.getElementById("addBtn");
const formDiv = document.querySelector(".form-div");
const closeBtn = document.getElementById("close");

const dashboard = document.querySelector(".dashboard");
const dashboardMiddle = document.querySelector(".dashboard-middle");
const transactions = document.querySelector(".Transactions-tab");
const settings = document.querySelector(".settings-tab");

const dashboardButton = document.getElementById("Dashboard");
const settingsButton = document.getElementById("Settings");

const form = document.querySelector("#Transaction-form");
const transactionList = document.querySelector(".transaction-list");

const profileName = document.querySelector("#Name");
const Currency = document.querySelector("#currency");
const profileBtn = document.querySelector("#profileBtn");

const usernameNav = document.querySelector("#Username");

const loginPage = document.querySelector(".login-page");
const signupPage = document.querySelector(".signup-page");

const signupBtn = document.querySelector("#showSignup");
const loginBtn = document.querySelector("#showLogin");

const signupName = document.querySelector("#signupName");
const signupEmail = document.querySelector("#signupEmail");
const signupPassword = document.querySelector("#signupPassword");

const signupForm = document.querySelector("#signupForm");
const loginForm = document.querySelector("#loginForm");

const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");

const logoutBtn = document.querySelector("#logoutBtn");

const darkModeToggle = document.querySelector("#darkMode");

const resetBtn = document.querySelector("#resetBtn");


/* Search + filter */

const searchInput =
  document.querySelector(".transaction-text input");

const typeFilter =
  document.querySelector(".transaction-text select");


/* =========================================================
   APPLICATION DATA
========================================================= */

let TransactionsArr = [];

let currentUserEmail = null;

let cashFlowChart = null;

let profile = {
  name: "",
  currency: "$"
};


/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const USER_KEY = "fintrackUser";

const SESSION_KEY = "fintrackSession";

const THEME_KEY = "theme";


/*
  Each user's transactions are stored separately.

  Example:

  fintrackTransactions_user@gmail.com
*/

function getTransactionKey() {

  if (!currentUserEmail) {
    return null;
  }

  return `fintrackTransactions_${currentUserEmail}`;

}


function getProfileKey() {

  if (!currentUserEmail) {
    return null;
  }

  return `fintrackProfile_${currentUserEmail}`;

}


/* =========================================================
   AUTHENTICATION / SESSION
========================================================= */


/* Check whether user is logged in */

function isLoggedIn() {

  return currentUserEmail !== null;

}


/* Show application */

function showApp() {

  loginPage.style.display = "none";
  signupPage.style.display = "none";

}


/* Show login page */

function showLoginPage() {

  loginPage.style.display = "grid";
  signupPage.style.display = "none";

}


/* Show signup page */

function showSignupPage() {

  loginPage.style.display = "none";
  signupPage.style.display = "grid";

}


/* =========================================================
   SIGN UP
========================================================= */

signupBtn.addEventListener("click", () => {

  showSignupPage();

});


loginBtn.addEventListener("click", () => {

  showLoginPage();

});


signupForm.addEventListener("submit", (event) => {

  event.preventDefault();


  const name = signupName.value.trim();

  const email = signupEmail.value.trim().toLowerCase();

  const password = signupPassword.value;


  if (!name || !email || !password) {

    alert("Please fill all fields.");

    return;

  }


  /* Check if account already exists */

  const existingUser =
    JSON.parse(localStorage.getItem(USER_KEY));


  if (existingUser && existingUser.Email === email) {

    alert("An account with this email already exists.");

    return;

  }


  /* Create user */

  const signupInfo = {

    Name: name,

    Email: email,

    Password: password

  };


  /* Save account */

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(signupInfo)
  );


  /* Create default profile */

  const newProfile = {

    name: name,

    currency: "$"

  };


  localStorage.setItem(
    `fintrackProfile_${email}`,
    JSON.stringify(newProfile)
  );


  /* Create empty transaction array */

  localStorage.setItem(
    `fintrackTransactions_${email}`,
    JSON.stringify([])
  );


  /* Put name into settings */

  profileName.value = name;

  Currency.value = "$";


  /* Clear signup form */

  signupForm.reset();


  /* Go to login */

  showLoginPage();


  alert("Account created successfully. Please login.");

});


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener("submit", (event) => {

  event.preventDefault();


  const savedUser =
    JSON.parse(localStorage.getItem(USER_KEY));


  if (!savedUser) {

    alert("Create an account before logging in.");

    return;

  }


  const email =
    loginEmail.value.trim().toLowerCase();

  const password =
    loginPassword.value;


  if (
    email === savedUser.Email &&
    password === savedUser.Password
  ) {

    /* Store current session */

    currentUserEmail = savedUser.Email;


    localStorage.setItem(
      SESSION_KEY,
      currentUserEmail
    );


    /* Load profile */

    loadProfile();


    /* Load transactions */

    loadTransactions();


    /* Show username */

    usernameNav.innerText =
      profile.name || savedUser.Name;


    /* Show app */

    showApp();


    /* Go to dashboard */

    selectPage("dashboard");


    /* Clear login form */

    loginForm.reset();


    alert("Login Successful!");

  } else {

    alert("Email or Password is Incorrect.");

  }

});


/* =========================================================
   LOAD SAVED SESSION
========================================================= */

function restoreSession() {

  const savedSession =
    localStorage.getItem(SESSION_KEY);


  const savedUser =
    JSON.parse(localStorage.getItem(USER_KEY));


  if (
    savedSession &&
    savedUser &&
    savedSession === savedUser.Email
  ) {

    currentUserEmail = savedSession;


    loadProfile();

    loadTransactions();


    usernameNav.innerText =
      profile.name || savedUser.Name;


    showApp();


    selectPage("dashboard");


  } else {

    showLoginPage();

  }

}


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener("click", () => {

  /*
    Remove only the current session.

    We DO NOT delete:
    - account
    - profile
    - transactions
  */

  localStorage.removeItem(SESSION_KEY);


  currentUserEmail = null;

  TransactionsArr = [];


  /* Clear transaction table */

  transactionList.innerHTML = "";


  /* Reset dashboard */

  updateDashboard();


  /* Show login */

  showLoginPage();


  loginForm.reset();


  alert("Logged out successfully.");

});


/* =========================================================
   PROFILE
========================================================= */

function loadProfile() {

  if (!currentUserEmail) {
    return;
  }


  const profileKey =
    getProfileKey();


  const savedProfile =
    JSON.parse(localStorage.getItem(profileKey));


  if (savedProfile) {

    profile = savedProfile;

  } else {

    /*
      If profile doesn't exist,
      create one from account.
    */

    const savedUser =
      JSON.parse(localStorage.getItem(USER_KEY));


    profile = {

      name: savedUser?.Name || "",

      currency: "$"

    };


    localStorage.setItem(
      profileKey,
      JSON.stringify(profile)
    );

  }


  /* Put profile into settings */

  profileName.value =
    profile.name || "";


  Currency.value =
    profile.currency || "$";


  /* Update navbar */

  usernameNav.innerText =
    profile.name || "Username";

}


/* =========================================================
   UPDATE PROFILE
========================================================= */

profileBtn.addEventListener("click", () => {

  if (!currentUserEmail) {

    alert("Please login first.");

    return;

  }


  const name =
    profileName.value.trim();


  const currency =
    Currency.value;


  if (!name) {

    alert("Please enter your name.");

    return;

  }


  profile = {

    name: name,

    currency: currency

  };


  /* Save profile */

  localStorage.setItem(
    getProfileKey(),
    JSON.stringify(profile)
  );


  /* Update navbar */

  usernameNav.innerText =
    profile.name;


  /* Update dashboard */

  updateDashboard();


  /* Re-render transactions */

  renderTransactions();


  alert("Profile updated successfully.");

});


/* =========================================================
   TRANSACTIONS - LOAD
========================================================= */

function loadTransactions() {

  if (!currentUserEmail) {

    TransactionsArr = [];

    return;

  }


  const transactionKey =
    getTransactionKey();


  const savedTransactions =
    JSON.parse(
      localStorage.getItem(transactionKey)
    );


  if (Array.isArray(savedTransactions)) {

    TransactionsArr =
      savedTransactions;

  } else {

    TransactionsArr = [];

  }


  /* Display */

  renderTransactions();


  /* Update dashboard */

  updateDashboard();

}


/* =========================================================
   TRANSACTIONS - SAVE
========================================================= */

function saveTransactions() {

  if (!currentUserEmail) {

    return;

  }


  localStorage.setItem(

    getTransactionKey(),

    JSON.stringify(TransactionsArr)

  );

}


/* =========================================================
   ADD TRANSACTION POPUP
========================================================= */

function openForm() {

  formDiv.style.display = "flex";

}


function closeForm() {

  formDiv.style.display = "none";

}


addBtn.addEventListener("click", openForm);

closeBtn.addEventListener("click", closeForm);


/* =========================================================
   ADD TRANSACTION
========================================================= */

form.addEventListener("submit", (event) => {

  event.preventDefault();


  if (!currentUserEmail) {
    alert("Please login first.");
    return;
  }


  const description =
    form.description.value.trim();

  const amount =
    Number(form.amount.value);

  const date =
    form.date.value;

  const category =
    form.category.value;

  const type =
    form.type.value;


  if (
    description === "" ||
    !amount ||
    amount <= 0 ||
    date === "" ||
    category === ""
  ) {

    alert("Please fill all fields correctly.");

    return;

  }


  /* ==========================================
     EDIT EXISTING TRANSACTION
  ========================================== */

  const editingId =
    Number(form.dataset.editingId);


  if (editingId) {

    const transaction =
      TransactionsArr.find(
        transaction =>
          transaction.id === editingId
      );


    if (transaction) {

      transaction.type = type;

      transaction.description =
        description;

      transaction.amount =
        amount;

      transaction.date =
        date;

      transaction.category =
        category;

    }


    delete form.dataset.editingId;


    document.getElementById("head").innerText =
      "Add Transaction";


    document.getElementById("submitBtn").innerText =
      "Submit";


  }


  /* ==========================================
     ADD NEW TRANSACTION
  ========================================== */

  else {

    const transaction = {

      id: Date.now(),

      type: type,

      description: description,

      amount: amount,

      date: date,

      category: category

    };


    TransactionsArr.push(transaction);

  }


  /* ==========================================
     SAVE EVERYTHING
  ========================================== */

  saveTransactions();


  /* ==========================================
     UPDATE UI
  ========================================== */

  renderTransactions();

  updateDashboard();


  form.reset();

  closeForm();

});


/* =========================================================
   RENDER TRANSACTIONS
========================================================= */

function renderTransactions() {

  transactionList.innerHTML = "";


  let filteredTransactions =
    [...TransactionsArr];


  /* =========================
     SEARCH
  ========================= */

  const searchValue =
    searchInput?.value
      .trim()
      .toLowerCase();


  if (searchValue) {

    filteredTransactions =
      filteredTransactions.filter(transaction =>

        transaction.description
          .toLowerCase()
          .includes(searchValue)

        ||

        transaction.category
          .toLowerCase()
          .includes(searchValue)

        ||

        transaction.date
          .includes(searchValue)

      );

  }


  /* =========================
     TYPE FILTER
  ========================= */

  const selectedType =
    typeFilter?.value;


  if (selectedType === "Income Only") {

    filteredTransactions =
      filteredTransactions.filter(
        transaction =>
          transaction.type === "Income"
      );

  }


  if (selectedType === "Expense Only") {

    filteredTransactions =
      filteredTransactions.filter(
        transaction =>
          transaction.type === "Expense"
      );

  }


  /* =========================
     DISPLAY
  ========================= */

  filteredTransactions.forEach(transaction => {

    addTransactionToUI(transaction);

  });


  /* Empty state */

  if (filteredTransactions.length === 0) {

    transactionList.innerHTML = `

      <div class="no-transactions">

        <p>No transactions found.</p>

      </div>

    `;

  }

}


/* =========================================================
   TRANSACTION UI
========================================================= */

function addTransactionToUI(transaction) {

  const row =
    document.createElement("div");


  row.className =
    "transaction-row";


  row.innerHTML = `

    <p>
      ${transaction.date}
    </p>


    <p>
      ${transaction.description}
    </p>


    <p>

      <span class="category-tag">

        ${transaction.category}

      </span>

    </p>


    <p class="${
      transaction.type === "Income"
        ? "income"
        : "expense"
    }">

      ${
        transaction.type === "Income"
          ? "+"
          : "-"
      }

      ${profile.currency}

      ${Number(transaction.amount).toFixed(2)}

    </p>


    <div class="action-icons">

      <button
        class="editBtn"
        data-id="${transaction.id}"
      >

        <i class="ri-pencil-fill edit-icon"></i>

      </button>


      <button
        class="dltBtn"
        data-id="${transaction.id}"
      >

        <i class="ri-delete-bin-fill delete-icon"></i>

      </button>

    </div>

  `;


  transactionList.appendChild(row);

}


/* =========================================================
   DELETE TRANSACTION
========================================================= */

transactionList.addEventListener("click", (event) => {

  const deleteButton =
    event.target.closest(".dltBtn");


  if (!deleteButton) {
    return;
  }


  const id =
    Number(deleteButton.dataset.id);


  const confirmDelete =
    confirm(
      "Are you sure you want to delete this transaction?"
    );


  if (!confirmDelete) {
    return;
  }


  TransactionsArr =
    TransactionsArr.filter(
      transaction =>
        transaction.id !== id
    );


  /* Save */

  saveTransactions();


  /* Refresh */

  renderTransactions();

  updateDashboard();

});


/* =========================================================
   EDIT TRANSACTION
========================================================= */

transactionList.addEventListener("click", (event) => {

  const editButton =
    event.target.closest(".editBtn");


  if (!editButton) {
    return;
  }


  const id =
    Number(editButton.dataset.id);


  const transaction =
    TransactionsArr.find(
      transaction =>
        transaction.id === id
    );


  if (!transaction) {
    return;
  }


  /*
    Put old transaction values
    back into form.
  */

  form.type.value =
    transaction.type;


  form.description.value =
    transaction.description;


  form.amount.value =
    transaction.amount;


  form.date.value =
    transaction.date;


  form.category.value =
    transaction.category;


  /*
    Store the ID being edited
  */

  form.dataset.editingId =
    id;


  document.getElementById("head").innerText =
    "Edit Transaction";


  document.getElementById("submitBtn").innerText =
    "Update";


  openForm();

});


/* =========================================================
   HANDLE EDIT SUBMISSION
========================================================= */

form.addEventListener("submit", (event) => {

  /*
    The previous submit listener already handles
    normal transactions.

    This section checks whether this form
    is editing an existing transaction.
  */

  const editingId =
    Number(form.dataset.editingId);


  if (!editingId) {
    return;
  }


  event.preventDefault();


  const transaction =
    TransactionsArr.find(
      transaction =>
        transaction.id === editingId
    );


  if (!transaction) {
    return;
  }


  transaction.type =
    form.type.value;


  transaction.description =
    form.description.value.trim();


  transaction.amount =
    Number(form.amount.value);


  transaction.date =
    form.date.value;


  transaction.category =
    form.category.value;


  /* Save */

  saveTransactions();


  /* Refresh */

  renderTransactions();

  updateDashboard();


  /* Clear edit mode */

  delete form.dataset.editingId;


  document.getElementById("head").innerText =
    "Add Transaction";


  document.getElementById("submitBtn").innerText =
    "Submit";


  form.reset();

  closeForm();

});


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    renderTransactions
  );

}


/* =========================================================
   FILTER
========================================================= */

if (typeFilter) {

  typeFilter.addEventListener(
    "change",
    renderTransactions
  );

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

  let totalIncome = 0;

  let totalExpense = 0;


  TransactionsArr.forEach(transaction => {

    const amount =
      Number(transaction.amount) || 0;


    if (transaction.type === "Income") {

      totalIncome += amount;

    } else {

      totalExpense += amount;

    }

  });


  const balance =
    totalIncome - totalExpense;


  /* =========================
     CARDS
  ========================= */

  document.getElementById("income").innerText =

    `${profile.currency}${totalIncome.toFixed(2)}`;


  document.getElementById("expense").innerText =

    `${profile.currency}${totalExpense.toFixed(2)}`;


  document.getElementById("balance").innerText =

    `${profile.currency}${balance.toFixed(2)}`;


  document.getElementById("transactionCount").innerText =

    TransactionsArr.length;


  /* =========================
     MONTHLY DATA
  ========================= */

  const months = [

    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"

  ];


  const incomeData =
    new Array(12).fill(0);


  const expenseData =
    new Array(12).fill(0);


  TransactionsArr.forEach(transaction => {

    if (!transaction.date) {
      return;
    }


    /*
      Add T00:00:00 so browser timezone
      doesn't accidentally shift the date.
    */

    const date =
      new Date(
        transaction.date + "T00:00:00"
      );


    const month =
      date.getMonth();


    const amount =
      Number(transaction.amount) || 0;


    if (transaction.type === "Income") {

      incomeData[month] += amount;

    } else {

      expenseData[month] += amount;

    }

  });


  /* =========================
     CHART
  ========================= */

  if (!cashFlowChart) {

    cashFlowChart =
      new Chart(ctx, {

        type: "line",


        data: {

          labels: months,


          datasets: [

            {

              label: "Income",

              data: incomeData,

              borderColor: "#16a34a",

              backgroundColor: "#16a34a",

              tension: 0.3,

              borderWidth: 2

            },


            {

              label: "Expenses",

              data: expenseData,

              borderColor: "#dc2626",

              backgroundColor: "#dc2626",

              tension: 0.3,

              borderWidth: 2

            }

          ]

        },


        options: {

          responsive: true,

          maintainAspectRatio: false,


          plugins: {

            legend: {

              position: "top"

            }

          },


          scales: {

            y: {

              beginAtZero: true,


              ticks: {

                callback: function(value) {

                  return (
                    profile.currency +
                    value
                  );

                }

              }

            }

          }

        }

      });


  } else {

    /*
      Don't destroy the chart.
      Just update its data.
    */

    cashFlowChart.data.datasets[0].data =
      incomeData;


    cashFlowChart.data.datasets[1].data =
      expenseData;


    /*
      Update currency on chart
    */

    cashFlowChart.options.scales.y.ticks.callback =
      function(value) {

        return (
          profile.currency +
          value
        );

      };


    cashFlowChart.update();

  }

}


/* =========================================================
   RESET ALL TRANSACTIONS
========================================================= */

if (resetBtn) {

  resetBtn.addEventListener("click", () => {

    if (!currentUserEmail) {

      alert("Please login first.");

      return;

    }


    if (TransactionsArr.length === 0) {

      alert("There is no transaction data to reset.");

      return;

    }


    const confirmed =
      confirm(
        "Are you sure you want to delete ALL transactions?"
      );


    if (!confirmed) {
      return;
    }


    /* Empty array */

    TransactionsArr = [];


    /* Save empty array */

    saveTransactions();


    /* Refresh UI */

    renderTransactions();

    updateDashboard();


    alert("All transaction data has been deleted.");

  });

}


/* =========================================================
   DASHBOARD / SETTINGS NAVIGATION
========================================================= */

function selectPage(page) {

  const isDashboard =
    page === "dashboard";


  dashboard.style.display =
    isDashboard ? "grid" : "none";


  dashboardMiddle.style.display =
    isDashboard ? "flex" : "none";


  transactions.style.display =
    isDashboard ? "flex" : "none";


  settings.style.display =
    isDashboard ? "none" : "flex";


  dashboardButton.classList.toggle(
    "active",
    isDashboard
  );


  settingsButton.classList.toggle(
    "active",
    !isDashboard
  );

}


dashboardButton.addEventListener(
  "click",
  () => {

    selectPage("dashboard");

  }
);


settingsButton.addEventListener(
  "click",
  () => {

    selectPage("settings");

  }
);


/* =========================================================
   DARK MODE
========================================================= */

function setTheme(isDark) {

  document.body.classList.toggle(
    "light-mode",
    !isDark
  );


  darkModeToggle.checked =
    isDark;


  localStorage.setItem(
    THEME_KEY,
    isDark ? "dark" : "light"
  );

}


function loadTheme() {

  const savedTheme =
    localStorage.getItem(THEME_KEY);


  if (savedTheme === "light") {

    setTheme(false);

  } else {

    setTheme(true);

  }

}


darkModeToggle.addEventListener(
  "change",
  () => {

    setTheme(
      darkModeToggle.checked
    );

  }
);


/* =========================================================
   INITIALIZATION
========================================================= */

loadTheme();

restoreSession();


/*
  If there is no session,
  keep login screen visible.
*/

if (!currentUserEmail) {

  showLoginPage();

}