let firstClick = true;
const btn = document.querySelector(".continue");
const zwImg = document.querySelector(".zw");
const hImg = document.querySelector(".h");
const bub = document.querySelector('.bub');
const courses = document.querySelector('.courses');
const courseBtns = document.querySelectorAll('.courses button');

const customAlert = document.getElementById('customAlert');
const closeAlertBtn = document.getElementById('closeAlertBtn');
const customAlertMsg = document.getElementById('customAlertMsg');


btn.addEventListener("click", function() {
    if (firstClick) {
        zwImg.style.top = "50px";
        zwImg.style.left = "50px";
        zwImg.style.transform = "none";
        zwImg.style.height = "90px";
        hImg.style.display = 'none';
        bub.classList.add('visible');
        courses.classList.add('visible');
        firstClick = false;
    } else {
        if(clicked === ''){
            customAlertMsg.textContent = "Select your course!";
            customAlert.classList.add('visible');
        }
        else if(clicked != 0){
            customAlertMsg.textContent = "Only Python is available, for now.";
            customAlert.classList.add('visible');
        }
        else{
            window.location.href = "home2.html";
        }
        
    }
});

let clicked = '';

courseBtns.forEach((btn, idx) => {
    btn.addEventListener("click", function() {
        // Remove highlight from all
        courseBtns.forEach(b => b.classList.remove("selected"));
        // Highlight the selected
        btn.classList.add("selected");
        // Update clicked index
        clicked = idx;
        console.log(clicked);
    });
});

closeAlertBtn.addEventListener('click', function() {
    customAlert.classList.remove('visible');
});


