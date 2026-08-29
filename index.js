const addBtn = document.querySelector("#addBtn");
const formDiv = document.querySelector(".form-div");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector("#close");
const ctx = document.getElementById('cashFlowChart');


let Form_button_Functions = ()=>{
    addBtn.addEventListener("click", ()=>{
    formDiv.style.display ="flex";
    overlay.style.display ="flex";
    });

    closeBtn.addEventListener("click", ()=>{

    formDiv.style.display ="none";
    overlay.style.display ="none";

    });
};

Form_button_Functions();

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