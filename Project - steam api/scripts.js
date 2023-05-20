window.onload = function() {
    var modal = document.getElementById("loginModal");
    var btn = document.querySelector(".login-button");
    var span = document.querySelector(".close-button");
    var loginButton = document.getElementById("loginButton");
    var nicknameElement = document.querySelector(".user-nickname");
    var profilePicElement = document.querySelector(".profile-pic");

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    var form = document.querySelector("form");
    form.addEventListener("submit", function(e) {
        e.preventDefault(); // Stop the form from submitting normally

        var id = document.getElementById("id").value;
        var url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=APIKEY&steamids=${id}`;
        var proxyUrl = 'http://omigo.me:8888/';

        var statusElement = document.querySelector(".status");
        statusElement.textContent = "Loading...";
        statusElement.classList.add("loading");
    
        fetch(proxyUrl + url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(data => {
                var userInfo = data.response.players[0];
                var nicknameElement = document.querySelector(".user-nickname");
                var profilePicElement = document.querySelector(".profile-pic");
    
                nicknameElement.innerText = userInfo.personaname;
                profilePicElement.src = userInfo.avatar;
    
                statusElement.textContent = "Login successful!";
                statusElement.classList.remove("loading");
                statusElement.classList.add("success");

                localStorage.setItem("userId", id);

                loginButton.textContent = "Log out";
            })
            .catch(error => {
                statusElement.textContent = "An error occurred: " + error.message;
                statusElement.classList.remove("loading");
                statusElement.classList.add("error");
            });
    });

    loginButton.addEventListener("click", function() {
        if (loginButton.textContent === "Log out") {
            // Restore default username and profile picture
            nicknameElement.innerText = "not logged in";
            profilePicElement.src = "https://icon-library.com/images/steam-question-mark-icon/steam-question-mark-icon-29.jpg";
            
            // Change "Log out" back to "Log in"
            localStorage.removeItem("userId");

            loginButton.textContent = "Log in";
        } else {
            modal.style.display = "block";
        }
    });

    var storedId = localStorage.getItem("userId");
    if (storedId) {
        // Update the UI with stored ID
        document.getElementById("id").value = storedId;
        loginButton.textContent = "Log out";
    }
}
