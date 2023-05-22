window.onload = function() {
    var modal = document.getElementById("loginModal");
    var btn = document.querySelector(".login-button");
    var span = document.querySelector(".close-button");
    var loginButton = document.getElementById("loginButton");
    var nicknameElement = document.querySelector(".user-nickname");
    var profilePicElement = document.querySelector(".profile-pic");
    const secretValue = "";

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
        var url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${secretValue}&steamids=${id}`;
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

        calculateTotalSpent(storedId, secretValue);
        calculateInventoryWorth(storedId, secretValue);
    }
}

function calculateTotalSpent(id, secretValue) {
    var gamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${secretValue}&steamid=${id}&include_appinfo=1&include_played_free_games=1`;
    var gamePricesUrlBase = 'http://store.steampowered.com/api/appdetails?appids=';
    var proxyUrl = 'http://omigo.me:8888/';

    // Fetch the list of games the user owns
    fetch(proxyUrl + gamesUrl)
      .then(response => response.json())
      .then(data => {
        var games = data.response.games;
        var totalWorth = 0;

        // Iterate over each game
        games.forEach(game => {
          // Fetch the current price of the game
          var gamePricesUrl = gamePricesUrlBase + game.appid;
          fetch(proxyUrl + gamePricesUrl)
            .then(response => response.json())
            .then(gameData => {
              var price = gameData[game.appid].data.price_overview.final;

              totalWorth += price;

              // Update UI with total worth
              document.getElementById('gamesWorth').innerText = `Games worth: ${totalWorth}`;
            });
        });
      })
      .catch(error => console.error('Error:', error));
}

function calculateInventoryWorth(id, secretValue) {
    var inventoryUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${secretValue}&steamid=${id}&include_appinfo=1&include_played_free_games=1`;
    var itemPricesUrlBase = 'http://api.steampowered.com/ISteamEconomy/GetAssetPrices/v0001?'; // Base URL for fetching item prices
    var proxyUrl = 'http://omigo.me:8888/';

    // Fetch the user's inventory
    fetch(proxyUrl + inventoryUrl)
      .then(response => response.json())
      .then(data => {
        var items = data.response.games;
        var totalWorth = 0;

        // Iterate over each item in the user's inventory
        items.forEach(item => {
          // Fetch the current price of the item
          var itemPricesUrl = itemPricesUrlBase + 'appid=' + item.appid;
          fetch(proxyUrl + itemPricesUrl)
            .then(response => response.json())
            .then(itemData => {
              // Assuming 'prices' is the correct field name, this will need to be updated according to the actual response structure
              var price = itemData.result.prices[item.appid].price;

              totalWorth += price;

              // Update UI with total worth
              document.getElementById('inventoryWorth').innerText = `Inventory worth: ${totalWorth}`;
            })
        });
      })
      .catch(error => console.error('Error:', error));
}
