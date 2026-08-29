const settings = document.querySelector(".settings-tab");
const dashboard = document.querySelector(".dashboard");
const cashFlow = document.querySelector(".cash-flow");
const preference = document.querySelector(".preference-tab");
const transactions = document.querySelector(".Transactions-tab");
const ctx = document.getElementById("cashFlowChart");

new Chart(ctx, {
    type: 'line',

    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],

        datasets: [
            {
                label: 'Income',
                data: [2000, 3500, 2800, 4200, 3800, 5000],
                borderColor: '#16a34a',
                backgroundColor: '#16a34a',
                tension: 0.3
            },

            {
                label: 'Expenses',
                data: [1500, 2200, 1800, 3000, 2500, 3200],
                borderColor: '#dc2626',
                backgroundColor: '#dc2626',
                tension: 0.3
            }
        ]
    },

    options: {
        responsive: true,

        plugins: {
            legend: {
                position: 'top'
            }
        },

        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


function selectDashboard() {

    // Active button
    document.getElementById("Dashboard").classList.add("active");
    document.getElementById("Settings").classList.remove("active");

    // Show Dashboard
    dashboard.style.display = "grid";
    cashFlow.style.display = "flex";
    preference.style.display = "flex";
    transactions.style.display = "flex";

    // Hide Settings
    settings.style.display = "none";
}


function selectSettings() {

    // Active button
    document.getElementById("Settings").classList.add("active");
    document.getElementById("Dashboard").classList.remove("active");

    // Hide Dashboard
    dashboard.style.display = "none";
    cashFlow.style.display = "none";
    preference.style.display = "none";
    transactions.style.display = "none";

    // Show Settings
    settings.style.display = "flex";
}

selectDashboard();