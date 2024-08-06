// Import the JSON data about the crowd-funded games from the games.js file
import GAMES_DATA from './games.js';

// Create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// Remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// Create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    for (const game of games) {
        const gameCard = document.createElement("div");
        gameCard.classList.add("game-card");

        gameCard.innerHTML = `
            <img src="${game.img}" class="game-img" alt="${game.name}">
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p>Backers: ${game.backers.toLocaleString()}</p>
            <!-- Removed Amount Raised line -->
        `;

        gamesContainer.appendChild(gameCard);
    }
}

// Call the function to add all games to the page
addGamesToPage(GAMES_JSON);

// Grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");
const totalContributions = GAMES_JSON.reduce((acc, game) => acc + game.backers, 0);
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// Grab the amount raised card
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// Grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`;

// Show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);
    addGamesToPage(unfundedGames);
}

// Show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);
    addGamesToPage(fundedGames);
}

// Show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    addGamesToPage(GAMES_JSON);
}

// Select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// Add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

// Grab the description container
const descriptionContainer = document.getElementById("description-container");

// Calculate the number of unfunded games
const numberOfUnfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// Create a dynamic message based on the number of unfunded games
const displayStr = `
    A total of $${totalRaised.toLocaleString()} has been raised for ${GAMES_JSON.length} game(s). 
    ${numberOfUnfundedGames === 1
        ? `Currently, 1 game remains unfunded.`
        : `Currently, ${numberOfUnfundedGames} games remain unfunded.`} 
    We need your help to fund these amazing games!
`;

// Create a paragraph element to hold the message
const descriptionElement = document.createElement("p");
descriptionElement.innerHTML = displayStr;

// Add the paragraph element to the description container
descriptionContainer.appendChild(descriptionElement);

// Show the top 2 games based on amount pledged
const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

// Sort games by amount pledged in descending order
const sortedGames = [...GAMES_JSON].sort((a, b) => b.pledged - a.pledged);

// Use destructuring to grab the first and second games
const [topGame, runnerUp] = sortedGames;

// Display the top game
firstGameContainer.querySelector('.game-details').innerHTML = topGame
    ? `<h4>${topGame.name}</h4>`
    : `<p>No top game available</p>`;

// Display the second most funded game
secondGameContainer.querySelector('.game-details').innerHTML = runnerUp
    ? `<h4>${runnerUp.name}</h4>`
    : `<p>No runner-up available</p>`;
