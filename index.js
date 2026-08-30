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

const logoutBtn = document.querySelector("#logoutBtn");




let TransactionsArr = [];

let profile = { 
     name: profileName.value,
     currency: Currency.value
};

let signupInfo = {

    Name: signupName.value,
    Email: signupEmail.value,
    Password: signupPassword.value
}



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

//settings profile updation



profileBtn.addEventListener("click", ()=>{ 

    profile = {
    name: profileName.value.trim(),
    currency: Currency.value
    };
    
    console.log(profile);

    usernameNav.innerText = profile.name;
    

})



//Form submit button

form.addEventListener("submit",(event)=>{
    event.preventDefault();


    const description = form.description.value.trim();
    const amount = form.amount.value.trim();

    if(description ==="" || amount === ""){
        alert("please fill all fields");
        return;
    } 

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
        ${transaction.type === "Income" ? "+" : "-"}${profile.currency}${transaction.amount}
      </p>
      <div class="action-icons">
        <button id="editBtn"><i class="ri-pencil-fill edit-icon"></i></button>
        <button id="dltBtn"><i class="ri-delete-bin-fill delete-icon"></i></button>
      </div>
    </div>
  `;
};

// login and signup navigation 

function loginActions(){
    
 signupBtn.addEventListener("click" ,()=>{
    signupPage.style.display ="grid"
    loginPage.style.display = "none"
 })

 loginBtn.addEventListener("click", () => {
  loginPage.style.display = "grid";
  signupPage.style.display = "none";
 });


 signupForm.addEventListener("submit",(event)=>{

    signupInfo = {
    Name: signupName.value.trim(),
    Email: signupEmail.value.trim(),
    Password: signupPassword.value
 }

  localStorage.setItem("fintrackUser", JSON.stringify(signupInfo));

  profileName.value = signupInfo.Name;
  usernameNav.innerText = signupInfo.Name;



  
  loginPage.style.display ="grid";
  alert("Now please login");
  form.reset();


 });

 loginForm.addEventListener("submit", (event) => {
   event.preventDefault();
   
   const savedUser = JSON.parse(
    localStorage.getItem("fintrackUser")
   );

    if (!savedUser) {
    alert("Create an account before logging in.");
    return;
   }

   const loginEmailValue = loginEmail.value.trim().toLowerCase();
   const loginPasswordValue = loginPassword.value;

   if(
    loginEmailValue === savedUser.Email &&
    loginPasswordValue === savedUser.Password
   ){
    signupPage.style.display = "none";
    loginPage.style.display = "none";

    usernameNav.innerText = savedUser.Name;

    alert("Login Successful!");
   }else{
    alert("Email or Password is Incorrect");
   }
 });
 
}

loginActions();

//logout button function

logoutBtn.addEventListener("click",()=>{
    loginPage.style.display = "grid";
})

//Dark mode toggle

const darkModeToggle = document.querySelector("#darkMode");

function setTheme(isDark) {
  document.body.classList.toggle("light-mode", !isDark);

  darkModeToggle.checked = isDark;

  localStorage.setItem("theme", isDark ? "dark" : "light");
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  setTheme(false);
} else {
  setTheme(true);
}

darkModeToggle.addEventListener("change", () => {
  setTheme(darkModeToggle.checked);
});





