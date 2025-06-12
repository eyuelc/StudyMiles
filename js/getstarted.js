let incentiveID = 0;
document.addEventListener("DOMContentLoaded", () => {
    const createAccountButton = document.querySelector(".createButton");

    createAccountButton.addEventListener("click", async () => {
        
        if (createAccountButton.disabled) return;
        
        const name = document.querySelector("input[name='Name']").value;
        const age = document.querySelector("input[name='Age']").value;
        const username = document.querySelector("input[name='Username']").value;
        const password = document.querySelector("input[name='password']").value;

        
        if (!name || !age || !username || !password) {
            alert("Please fill in all fields.");
            return;
        }

        createAccountButton.disabled = true;
        createAccountButton.querySelector(".button-text").style.display = "none";
        createAccountButton.querySelector(".spinner").style.display = "inline-block";


        const userData = {
            name,
            username,
            password
        };

        console.log(userData);

        const result = await createNewUser(userData);

        if (result) {
            
            const progressData = {
                userID: {
                    name: userData.name,
                    userID: result.userID,
                    username: userData.username,
                    password: userData.password
                },
                percentage: [0, 0, 0],
                lessonsCompleted: 0,
                lessonBreakDown: 0,
                streak: 0
            
            };

            const progressResult = await createProgress(progressData);


            const incentiveData = {
                userID: {
                    name: userData.name,
                    userID: result.userID,
                    username: userData.username,
                    password: userData.password
                },
                earnedTokens: 0,
                walletAddress: "000123"
            };

            const incentiveResult = await createIncentive(incentiveData);

            localStorage.setItem("userID", result.userID);
            alert("Account created successfully!");
            window.location.href = "course.html";
        }
        
    });
});

async function createNewUser(userData) {
    try {
        const response = await fetch("https://studymiles-2.onrender.com/new_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }

        const data = await response.json();
        console.log("User created:", data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function createProgress(progressData) {
    try {
        const response = await fetch("https://studymiles-2.onrender.com/progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(progressData)
        });
        if (!response.ok) {
            throw new Error("Failed to initialize progress");
        }

        const data = await response.json();
        console.log("Progress initialized:", data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function createIncentive(incentiveData) {
    try {
        const response = await fetch("https://studymiles-2.onrender.com/incentive", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(incentiveData)
        });
        if (!response.ok) {
            throw new Error("Failed to initialize incentive");
        }

        const data = await response.json();
        console.log("Incentive initialized:", data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}