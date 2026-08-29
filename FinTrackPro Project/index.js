const addBtn = document.querySelector("#addBtn");
const formDiv = document.querySelector(".form-div");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector("#close");


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
