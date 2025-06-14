import { LESes } from './data.js';

let userID = localStorage.getItem('userID');
let completedPercentage = [0, 0, 0];
let totalTokens;
let seconds = 0;
let takenSeconds = {
    section1: [0, 0, 0],
    section2: [0, 0, 0],
    section3: [0, 0, 0]
};

let currentSection = 0;
let currentLesson = 0;

document.addEventListener("DOMContentLoaded", async function () {
    function update() {
        seconds = parseInt(localStorage.getItem('seconds')) || 0;
        takenSeconds = JSON.parse(localStorage.getItem('takenSeconds')) || {
            section1: [0, 0, 0],
            section2: [0, 0, 0],
            section3: [0, 0, 0]
        };
    }
    async function fetchIncentiveData(userID) {
        try {
            // Fetch all incentives
            const response = await fetch("https://studymiles-2.onrender.com/incentive");
            if (!response.ok) {
                throw new Error("Failed to fetch incentive data");
            }

            const data = await response.json();
            const result = data.find(item => item.userID.userID === parseInt(userID));
            if (result) {
                const incentiveID = result.incentivesID;
                const incentiveResponse = await fetch(`https://studymiles-2.onrender.com/incentive/${incentiveID}`);
                if (!incentiveResponse.ok) {
                    throw new Error("Failed to fetch incentive details");
                }

                const incentiveData = await incentiveResponse.json();

                totalTokens = incentiveData.earnedTokens;
                document.getElementById('tokenCount').textContent = totalTokens; // Update the token counter in the UI
                return incentiveData; // Return the incentive data for further use
            } else {
                console.log("User not found in incentive data. while fetching");
                return null; // Return null if no incentive is found
            }
        } catch (error) {
            console.error("Error fetching incentive data:", error);
            return null; // Return null in case of an error
        }
    }

    async function fetchProgressData(userID) {
        try {
            const response = await fetch("https://studymiles-2.onrender.com/progress");
            if (!response.ok) {
                throw new Error("Failed to fetch progress data");
            }

            const data = await response.json();

            const result = data.find(item => item.userID.userID === parseInt(userID));
            if (result) {
                const progressID = result.progressID;

                const progressResponse = await fetch(`https://studymiles-2.onrender.com/progress/${progressID}`);
                if (!progressResponse.ok) {
                    throw new Error("Failed to fetch progress details");
                }

                const progressData = await progressResponse.json();

                currentSection = progressData.lessonsCompleted;
                currentLesson = progressData.lessonBreakDown;

                return { currentSection, currentLesson };
            } else {
                console.log("User not found in progress data.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching progress data:", error);
            return null;
        }
    }

    function calculateCompletedPercentage(currentSection, currentLesson) {
        const lessonsPerSection = 4;

        for (let i = 0; i < 3; i++) {
            if (i < currentSection) {
                completedPercentage[i] = 100;
            } else if (i === currentSection) {
                completedPercentage[i] = Math.round((currentLesson / lessonsPerSection) * 100);
            } else {
                completedPercentage[i] = 0;
            }
        }
    }

    await fetchProgressData(userID);
    calculateCompletedPercentage(currentSection, currentLesson);
    console.log('completedPercentage:', completedPercentage);

    update();
    fetchIncentiveData(userID);
    if (!userID) {
        alert("No user ID found. Please log in again.");
        window.location.href = "login.html";
        return;
    }
    
    try {
        const response = await fetch(`https://studymiles-2.onrender.com/new_user/${userID}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        document.querySelector("#userName").textContent = userData.name;

    } catch (error) {
        console.error("Error fetching user data:", error);
    }
    const percentages = document.querySelectorAll(".compStat");
    percentages.forEach((percentage, index) => {
        percentage.textContent = "completed: " + completedPercentage[index] + "%";
    })
    const tokens = document.querySelector('.tokenCount');
    tokens.textContent = totalTokens;

    const lessons = document.querySelectorAll(".title");
    lessons.forEach((lesson, lessonIndex) =>{
        const colorimg = lesson.querySelector('.color-image');
        colorimg.style.width = completedPercentage[lessonIndex];
        let CP;
        CP = 100 - completedPercentage[lessonIndex];
        colorimg.style.clipPath = `inset(0 ${CP}% 0 0)`;
    });
    const display = document.getElementById('display');
    function updateDisplay() {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        display.textContent = `${hrs}:${mins}:${secs}`;
    }
    updateDisplay();
    

    const historyButton = document.querySelector('.historylink'); 
    const historyContainer = document.querySelector('.hitoryCont'); 
    const closebtn = document.querySelector('.closeHistory'); 
   

    historyButton.addEventListener('click', () => {
        historyContainer.style.display = 'block';
    });


    closebtn.addEventListener('click', () => {
        historyContainer.style.display = 'none';
        
    });



    const historyItems = document.querySelectorAll('.historyItem');
    historyItems.forEach((history, i) => {
        const h61 = document.createElement('h6');
        const h62 = document.createElement('h6');
        const h63 = document.createElement('h6');

        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');

        const sectionKey = `section${i + 1}`;
        const lessons = LESes[sectionKey]; // Get all lessons for the current section

        // Check if lessons exist and access only valid entries
        const lessonData = lessons && lessons[0] && lessons[0].title ? lessons[0] : null;
        const lessonData2 = lessons && lessons[1] && lessons[1].title ? lessons[1] : null;
        const lessonData3 = lessons && lessons[2] && lessons[2].title ? lessons[2] : null;

        // Format time for span1, span2, and span3 using takenSeconds
        const formatTime = (seconds) => {
            const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            return `${hrs}:${mins}:${secs}`;
        };

        span1.textContent = formatTime(takenSeconds[`section${i + 1}`][0]); // Time for the first lesson
        span2.textContent = formatTime(takenSeconds[`section${i + 1}`][1]); // Time for the second lesson
        span3.textContent = formatTime(takenSeconds[`section${i + 1}`][2]); // Time for the third lesson

        span1.classList.add('timer'); // Add the 'timer' class to span1
        span2.classList.add('timer'); // Add the 'timer' class to span2
        span3.classList.add('timer'); // Add the 'timer' class to span3

        
        // Add text content or fallback to 'No data available'
        h61.textContent = lessonData ? lessonData.title : 'No data available';
        h61.appendChild(span1); // Append the time span to h61
        h62.textContent = lessonData2 ? lessonData2.title : 'No data available';
        h62.appendChild(span2); // Append the time span to h62
        h63.textContent = lessonData3 ? lessonData3.title : 'No data available';
        h63.appendChild(span3); // Append the time span to h63

        // Append the created <h6> elements to the current history item
        history.appendChild(h61);
        history.appendChild(h62);
        history.appendChild(h63); 
    });
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active'); // Toggle the 'active' class on the nav bar
    });

    function renderQuiz(quizText, container) {
        const questions = quizText.split(/\d+\.\s/).filter(Boolean);
        let html = '<form id="aiQuizForm">';
        questions.forEach((q, i) => {
            // Extract question, options, and answer
            const parts = q.split(/A\.|B\.|C\.|D\./);
            if (parts.length < 5) return;
            const question = parts[0].trim();
            const options = [
                parts[1].split('\n')[0].trim(),
                parts[2].split('\n')[0].trim(),
                parts[3].split('\n')[0].trim(),
                parts[4].split('\n')[0].trim()
            ];
            html += `<div class="quiz-question"><p><b>Q${i+1}:</b> ${question}</p>`;
            ['A','B','C','D'].forEach((letter, idx) => {
                html += `
                    <label>
                        <input type="radio" name="q${i}" value="${letter}">
                        ${letter}. ${options[idx]}
                    </label><br>
                `;
            });
            html += '</div><br>';
        });
        container.innerHTML = html;
    }

    let quizAnswers = []; 
    function parseQuizAnswers(quizText) {
        const answerMatches = quizText.match(/Answer:\s*([A-D])/g);
        if (!answerMatches) return [];
        return answerMatches.map(ans => ans.replace(/Answer:\s*/, '').trim());
    }

    document.querySelectorAll('.task2').forEach((task, idx) => {
        task.addEventListener('click', () => {
            document.getElementById('aiLessonModal').classList.add('active');
            const submitBtn = document.getElementById('submitAiQuiz');
            if (idx === 0) {
                document.querySelector('#aiLessonTitle').textContent = 'Daily Lesson by milesAI';
                submitBtn.style.display = 'none';
                aiLessonContent.innerHTML = `<div class="ai-spinner"><div class="spinner"></div></div>`;
                fetch('https://milesai.onrender.com/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: "Give me a random daily study lesson about Python. Keep it concise and actionable. Do not use any Markdown, asterisks (*), or special formatting—just plain text." })
                })
                .then(res => res.json())
                .then(data => {
                    aiLessonContent.innerHTML = `<div class="ai-lesson">${data.reply}</div>`;
                })
                .catch(() => {
                    aiLessonContent.innerHTML = `<div class="ai-lesson">Sorry, couldn't fetch your daily lesson.</div>`;
                });
                document.getElementById('submitAiQuiz').style.display = 'none';
            } else {
                document.querySelector('#aiLessonTitle').textContent = 'Random Quiz by MilesAI'
                submitBtn.style.display = 'block';
                aiQuizContainer.innerHTML = `<div class="ai-spinner"><div class="spinner"></div></div>`;
                fetch('https://milesai.onrender.com/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: "Give me a 5-question multiple choice quiz about Python basics. For each question, provide the question text and 4 options labeled A, B, C, D. Indicate the correct answer at the end of each question as Answer: X. Do not use any Markdown, asterisks (*), or special formatting—just plain text." })
                })
                .then(res => res.json())
                .then(data => {
                    quizAnswers = parseQuizAnswers(data.reply);
                    renderQuiz(data.reply, aiQuizContainer);

                })
                .catch(() => {
                    aiQuizContainer.innerHTML = `<div class="ai-quiz">Sorry, couldn't fetch your quiz.</div>`;
                });
                document.getElementById('submitAiQuiz').style.display = 'block';
                }
        });
    });

    document.getElementById('submitAiQuiz').addEventListener('click', function(e) {
        e.preventDefault();
        const form = document.getElementById('aiQuizForm');
        if (!form) return;
        const formData = new FormData(form);
        let correct = 0;
        let total = quizAnswers.length;
        let corrections = '';
        for (let i = 0; i < total; i++) {
            const userAns = formData.get(`q${i}`);
            if (userAns === quizAnswers[i]) {
                correct++;
            } else {
                // Find the question text and correct answer
                const questionDiv = form.querySelectorAll('.quiz-question')[i];
                const questionText = questionDiv.querySelector('p').textContent;
                corrections += `<div style="margin-bottom:8px;">
                    <b>${questionText}</b><br>
                    Your answer: <span style="color:#e74c3c">${userAns || 'No answer'}</span><br>
                    Correct answer: <span style="color:#27ae60">${quizAnswers[i]}</span>
                </div>`;
            }
        }
        // Show result and corrections
        aiQuizContainer.innerHTML = `
            <h3>Your Score: ${correct} / ${total}</h3>
            ${corrections ? `<h4>Corrections:</h4>${corrections}` : '<div style="color:#27ae60;">All answers correct! 🎉</div>'}
        `;
        document.getElementById('submitAiQuiz').style.display = 'none';
        document.querySelector('.closeAiModal').addEventListener('click', () => {
            document.getElementById('aiLessonModal').classList.remove('active');
            aiQuizContainer.innerHTML = '';
        });
    });

    document.querySelector('.closeAiModal').addEventListener('click', () => {
        document.getElementById('aiLessonModal').classList.remove('active');
        aiQuizContainer.innerHTML = '';
        aiLessonContent.innerHTML = '';
    });

    const mediaQuery = window.matchMedia('(max-width: 350px)'); // adjust for phone/tablet

    const pIContainer = document.querySelector('.pI');
    const taskSection = document.querySelector('.infos');
    const task2Blocks = document.querySelectorAll('.task.task2');

    function moveTask2IfNeeded(e) {
        if (e.matches) {
        task2Blocks.forEach(el => pIContainer.appendChild(el));
        } else {
        const taskContainers = taskSection.querySelectorAll('.task');
        const lastTask = [...taskContainers].reverse().find(t => !t.classList.contains('task2'));
        task2Blocks.forEach(el => {
            lastTask.insertAdjacentElement('afterend', el);
        });
        }
    }

    moveTask2IfNeeded(mediaQuery);

    mediaQuery.addEventListener('change', moveTask2IfNeeded);
}); 

