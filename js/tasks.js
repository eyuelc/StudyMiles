import { assignments} from './data.js';
let totalTokens = 0;

console.log(assignments)

document.addEventListener('DOMContentLoaded', () => {
    function update() {
        totalTokens = parseInt(localStorage.getItem('totalTokens')) || 0; 
    }

    function saveProgressToLocalStorage() {
        localStorage.setItem('totalTokens', totalTokens);
    };

    function updateCompleted() {
        const mileDivs = document.querySelectorAll('.mile');
        const submit = document.querySelector('.submitTask');
        mileDivs.forEach((mile, index) => {
            mile.addEventListener('click', ()=>{
                const doneIcon = mile.querySelector('.fa-check');
                if(mile.classList.contains('completed')){
                    if (!doneIcon) {
                        const done = document.createElement('i');
                        done.className = 'fa-solid fa-check'; // Add the Font Awesome check icon
                        mile.prepend(done); // Add the icon as the first child
                    }
                    mile.style.border = '2px solid green';
                }
                else{
                    submit.style.display = 'inline';
                }
            })
        })
    }

    updateCompleted();

    update();
    const tokens = document.querySelector('.tokenCount');
    tokens.textContent = totalTokens;
    
    const optionsContainer = document.querySelector('.options');
    const milesContainer = document.querySelector('.miles');

    
 
    const assignmentAmount = assignments.length;
    let assignmentContent = '';
    for (let i = 0; i < assignmentAmount; i++) {
        const assignment = assignments[i];
        const mileDiv = document.createElement('div');
        mileDiv.classList.add('mile');
        const imgDiv = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = assignment.title;
        mileDiv.appendChild(p);


        const img = document.createElement('img');
        img.src = 'img/icons/token.png'
        imgDiv.textContent = `+${assignment.token}`
        imgDiv.appendChild(img);
        mileDiv.appendChild(imgDiv);
        
        const milecont = document.createElement('div');

        milecont.appendChild(mileDiv)

        mileDiv.style.cursor = 'pointer';
        mileDiv.addEventListener('click', () => {
            
            
        });
        

        assignmentContent += milecont.innerHTML;
        updateCompleted();
        
    }
    

    

    

    const peerReviewContent = `
        <div class="mile">
            <p>Peer review 2</p>
            <div class="img">
                +3<img src="img/icons/token.png" alt="">
            </div>
        </div>
        <div class="mile">
            <p>Peer Review 1</p>
            <div class="img">
                +5<img src="img/icons/token.png" alt="">
            </div>
        </div>
        
    `;


    milesContainer.innerHTML = assignmentContent;


    optionsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'H3') {
            // Toggle classes for visual indication
            const options = optionsContainer.querySelectorAll('h3');
            options.forEach(item => {
                item.classList.remove('select');
                item.classList.add('unselect');
            });
            e.target.classList.remove('unselect');
            e.target.classList.add('select');

            // Change the content based on the selected option
            if (e.target.textContent.trim() === "Assignments") {
                milesContainer.innerHTML = assignmentContent;
            } else if (e.target.textContent.trim() === "Peer Reviews") {
                milesContainer.innerHTML = peerReviewContent;
            }
        }
    });

    const taskModal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDetails = document.getElementById('modalDetails');
    const modalToken = document.getElementById('modalToken');
    const closeModal = document.querySelector('.closeModal');
    const submitTask = document.querySelector('.submitTask');
    const mileDivs = document.querySelectorAll('.mile'); // Select all mileDiv elements

    const tokenCountElement = document.querySelector('.tokenCount'); // Update token counter
    const tokenMessage = document.querySelector('.tokenMessage'); // Update token message
    const tokenAnimation = document.querySelector('.token-animation'); // Trigger animation
    let currentMileDiv = null; // To track the currently clicked mileDiv

    // Open the modal when a mileDiv is clicked
   // Open the modal when a mileDiv is clicked
    mileDivs.forEach((mileDiv, index) => {
        
        mileDiv.addEventListener('click', () => {
            const assignment = assignments[index]; 
            console.log(assignment);
            modalTitle.textContent = assignment.title;
            modalDetails.textContent = assignment.detailedInstruction;
            taskModal.style.display = 'block'; 
            currentMileDiv = mileDiv; 

            updateCompleted();
            if(mileDiv.classList.contains('completed')){
                submitTask.style.display = 'none';
            }
            submitTask.addEventListener('click', () => {
                if(!(mileDiv.classList.contains('completed'))){
                        taskModal.style.display = 'none';
                        totalTokens += assignment.token;
                

                        tokenCountElement.textContent = totalTokens;
                

                        tokenMessage.textContent = `+${assignment.token} Tokens`;

                        tokenAnimation.style.animation = "growAndFade 1.5s ease-in-out forwards";

                        setTimeout(() => {
                            tokenAnimation.style.animation = "none";
                        }, 1500);
                        saveProgressToLocalStorage();
                        mileDiv.style.border = '2px solid green';
                        const p = mileDiv.querySelector('p')
                        const doneIcon = p.querySelector('.fa-check');
                        if (!doneIcon) {
                            const done = document.createElement('i');
                            done.className = 'fa-solid fa-check';
                            p.prepend(done);
                        }
                
                        mileDiv.classList.add('completed');
                }

                
                
            });
            
        });
        
    });
    
    // Close the modal
    closeModal.addEventListener('click', () => {
        taskModal.style.display = 'none'; // Hide the modal
    });

    
    submitTask.addEventListener('click', ()=>{
        updateCompleted();
    })
    

    // Close the modal when clicking outside the content
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            taskModal.style.display = 'none'; // Hide the modal
        }
    });
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active'); // Toggle the 'active' class on the nav bar
    });

});