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

const formSubmitBtn = document.querySelector("#submitBtn");
const form = document.querySelector("#Transaction-form");

const transactionList = document.querySelector(".transaction-list");


let TransactionsArr = [];

/* Cash Flow Chart */

new Chart(ctx, {
  type: "line",

  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

    datasets: [
      {
        label: "Income",
        data: [2000, 3500, 2800, 4200, 3800, 5000],
        borderColor: "#16a34a",
        backgroundColor: "#16a34a",
        tension: 0.3
      },
      {
        label: "Expenses",
        data: [1500, 2200, 1800, 3000, 2500, 3200],
        borderColor: "#dc2626",
        backgroundColor: "#dc2626",
        tension: 0.3
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
        beginAtZero: true
      }
    }
  }
});

/* Add Transaction popup */

function openForm() {
  formDiv.style.display = "flex";
}

function closeForm() {
  formDiv.style.display = "none";
}

/* Dashboard / Settings navigation */

function selectPage(page) {
  const isDashboard = page === "dashboard";

  dashboard.style.display = isDashboard ? "grid" : "none";
  dashboardMiddle.style.display = isDashboard ? "flex" : "none";
  transactions.style.display = isDashboard ? "flex" : "none";
  settings.style.display = isDashboard ? "none" : "flex";

  dashboardButton.classList.toggle("active", isDashboard);
  settingsButton.classList.toggle("active", !isDashboard);
}

/* Event listeners */

addBtn.addEventListener("click", openForm);
closeBtn.addEventListener("click", closeForm);

dashboardButton.addEventListener("click", () => {
  selectPage("dashboard");
});

settingsButton.addEventListener("click", () => {
  selectPage("settings");
});

/* Initial page */

selectPage("dashboard");

//Form submit button

form.addEventListener("submit",(event)=>{
    event.preventDefault();

    const transaction = {
    id:Date.now(),
    type: form.type.value,
    description: form.description.value,
    amount: form.amount.value,
    date: form.date.value,
    category: form.category.value
  };

  TransactionsArr.push(transaction);
  console.log(TransactionsArr);

  addTransactionToUI(transaction);

  form.reset();
  formDiv.style.display = "none";


});

// ui creation for transaction

function addTransactionToUI(transaction) {
  transactionList.innerHTML += `
    <div class="transaction-row">
      <p>${transaction.date}</p>
      <p>${transaction.description}</p>
      <p><span class="category-tag">${transaction.category}</span></p>
      <p class="${transaction.type === "Income" ? "income" : "expense"}">
        ${transaction.type === "Income" ? "+" : "-"}$${transaction.amount}
      </p>
      <div class="action-icons">
        <button id="editBtn"><i class="ri-pencil-fill edit-icon"></i></button>
        <button id="dltBtn"><i class="ri-delete-bin-fill delete-icon"></i></button>
      </div>
    </div>
  `;
}

