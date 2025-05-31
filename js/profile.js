let totalTokens;
let intID;
let userID = localStorage.getItem('userID');
document.addEventListener('DOMContentLoaded', async () => {

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
                intID = incentiveID;
                const incentiveResponse = await fetch(`https://studymiles-2.onrender.com/incentive/${incentiveID}`);
                if (!incentiveResponse.ok) {
                    throw new Error("Failed to fetch incentive details");
                }

                const incentiveData = await incentiveResponse.json();

                totalTokens = incentiveData.earnedTokens;
                document.getElementById('tokenCount').textContent = totalTokens; // Update the token counter in the UI
                document.getElementById('tokenCount2').textContent = totalTokens;
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

        document.querySelector(".userName").textContent = userData.name;
        document.querySelector(".userName2").textContent = userData.name;

    } catch (error) {
        console.error("Error fetching user data:", error);
    }
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active'); // Toggle the 'active' class on the nav bar
    });

    const profDiv = document.querySelector('.pf');

    const p = document.createElement('p');
    p.textContent = 'UserID:' + userID;

    const p2 = document.createElement('p');
    p2.textContent = 'IncentiveID:' + intID;

    profDiv.appendChild(p);
    profDiv.appendChild(p2);

});