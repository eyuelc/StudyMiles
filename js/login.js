document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector(".loginButton");

    loginButton.addEventListener("click", async () => {
        const userID = document.querySelector("input[name='username']").value;
        const password = document.querySelector("input[name='password']").value;

        if (!userID || !password) {
            alert("Please enter both userID and password.");
            return;
        }

        loginButton.disabled = true;
        loginButton.querySelector(".button-text").style.display = "none";
        loginButton.querySelector(".spinner").style.display = "inline-block";

 
        try {
            const response = await fetch(`https://studymiles-2.onrender.com/new_user/${userID}`);
            
            if (!response.ok) {
                throw new Error("User not found.");
            }

            const user = await response.json();

            if (user.password === password) {
                alert("Login successful!");
                localStorage.setItem("userID", userID);
                window.location.href = "home2.html"; // redirect to homepage
            } else {
                alert("Incorrect password.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed: " + error.message);
        }
    });
});
