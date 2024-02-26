/*----- constants -----*/

/*----- app's state (variables) -----*/
let turn;
let shipSelected;
let shipChoices;
let shipsPlaced;
let pBoard;
let cboard;
let selectedTile;

/*----- cached element references -----*/
const mainEl = document.querySelector("#game");
const mainMsgEl = document.querySelector(".main-message");
const gameMsgEl = document.querySelector(".game-message");
const startGameBtn = document.querySelector(".start-game-btn");
const ships = document.querySelectorAll(".ships > div");
const playerGameboard = document.getElementById("player-game-board");

/*----- functions -----*/
function init() {
    turn = null;
    shipSelected = null;
    shipsPlaced = [];
    shipChoices = {
        aircraft: { name: "aircraft", size: 5 },
        battleship: { name: "battleship", size: 4 },
        submarine: { name: "submarine", size: 3 },
        destroyer: { name: "destroyer", size: 3 },
        cruiser: { name: "cruiser", size: 2 },
    };
    pBoard = Array.from({ length: 10 }, () => Array(10).fill(0));
    cBoard = Array.from({ length: 10 }, () => Array(10).fill(0));
    render();
}
//----------------Rendering the board---------------//
function render() {
    mainEl.style.visibility = "visible";
    gameMsgEl.textContent = "Place your ships. Then hit Begin";
    mainMsgEl.textContent =
        "Click the ship below, then choose a tile to place your ship";
}

//----------------Setting the ship selcted----------//
function setShipSelected(evt) {
    //removes blue background if different ship is selected
    ships.forEach((ship) => {
        if (!shipsPlaced.includes(ship)) {
            ship.style.backgroundColor = "white";
        }
    });
    //returns if user didnt select a ship element
    if (evt.target.tagName !== "P") return;
    //setting the shipSelected variable
    shipSelected = evt.target.parentNode.id;
    //setting background to selected ship if it hasnt already been placed
    if (!shipsPlaced.includes(shipSelected)) {
        evt.target.parentNode.style.backgroundColor = "blue";
    }
}

//-----------Will need to check the board, to see if enough spaces above, and update the board arrays, and hilight the placement spots. evt.target gives me the div with the col# and row# ----------//
function placeShip(evt) {
    if (!shipSelected) {
        gameMsgEl.textContent = "Place choose a ship first";
    }
    let ship = shipChoices[shipSelected];
    //this lets me get the starting point to count spaces from
    selectedTile = evt.target.id.split("");
    console.log(selectedTile);
    pBoard[selectedTile[1]][selectedTile[3]] = 1;
    //now i need to see if the amount of spaces is avaliable for the ship size, if so, ask for confirmation with highlighted cells, then remove that ship from the options, and update the player board.
    let spacesAbove = 9 - pBoard[selectedTile[1]].indexOf(1);
    if (spacesAbove >= ship.size - 1) {
        console.log(spacesAbove);
    }
}

/*----- event listeners -----*/
startGameBtn.addEventListener("click", init);
ships.forEach((ship) => ship.addEventListener("click", setShipSelected));
playerGameboard.addEventListener("click", placeShip);
