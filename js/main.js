/*----- constants -----*/

/*----- app's state (variables) -----*/
let pBoard;
let cBoard;
let winner;
let pShips;
let cShips;
let shipsSize;
let currentShipSize;

/*----- cached element references -----*/
const mainEl = document.querySelector("#game");
const mainMsgEl = document.querySelector(".main-message");
const gameMsgEl = document.querySelector(".game-message");
const startGameBtn = document.querySelector(".start-game-btn");
const ships = document.querySelectorAll(".ships > div");
const playerGameboard = document.getElementById("player-game-board");

/*----- event listeners -----*/
startGameBtn.addEventListener("click", setShips);
ships.forEach((ship) => {
    ship.addEventListener("click", setShips);
});
playerGameboard.addEventListener("click", shipPlacement);
/*----- functions -----*/
init();
function init() {
    pBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    cBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    pShips = {
        ac: [],
        bs: [],
        sb: [],
        ds: [],
        cs: [],
    };
    cShips = {
        ac: [],
        bs: [],
        sb: [],
        ds: [],
        cs: [],
    };
    shipsSize = {
        aircraft: 5,
        battleship: 4,
        submarine: 3,
        destroyer: 3,
        cruiser: 2,
    };
    winner = null;
    render();
}

function checkVerticleSpace(startingCol, size) {
    //index of the value 1 in the starting  column
    let index = pBoard[startingCol].indexOf(1);
    let spacesAbove = pBoard[startingCol].length - 1 - index;
    //Calculating if there is enough space above and below to fit the ship
    let enoughSpacesAbove = spacesAbove >= size - 1 ? spacesAbove : false;
    // console.log(enoughSpacesAbove);
    return enoughSpacesAbove;
    // let enoughSpaceBelow = index >= size - 1 ? true : false;
}

function shipPlacement(evt) {
    if (!currentShipSize) {
        gameMsgEl.innerText = "Please Select a Ship First!!";
        return;
    }
    //getting ship coodinates;
    let tile = evt.target.id.split("");
    let tileCol = tile[1];
    let tileRow = tile[3];
    //update the player board with ship
    pBoard[tileCol][tileRow] = 1;
    //save starting point
    let startingPoint = pBoard[tileCol][tileRow];
    //change the first tile to light green, then calculate if there is enough space Above for the other parts of ship
    let enoughSpaceAbove = checkVerticleSpace(tileCol, currentShipSize);
    if (enoughSpaceAbove) {
        confirmPlacementVerticle(currentShipSize, tileCol);
    }
    if (!enoughSpaceAbove) {
        gameMsgEl.innerText = "There is not enough space for that ship there";
    }
}

function confirmPlacementVerticle(spaces, tileCol) {
    let i = pBoard[tileCol].indexOf(1);
    let count = 0;
    while (spaces > count) {
        document.getElementById(
            `c${tileCol}r${i + count}`
        ).style.backgroundColor = "lightgreen";
        count++;
    }
}

function getShipSize(target) {
    target.style.background = "white";
    if (target.tagName !== "DIV") return;
    target.style.background = "grey";
    return shipsSize[target.id];
}

function setShips(evt) {
    ships.forEach((ship) => {
        ship.style.background = "white";
    });
    mainEl.style.visibility = "visible";
    mainMsgEl.innerText = "Place your ships on your board below.";
    gameMsgEl.innerText = "When your ships are placed, hit begin.";
    startGameBtn.innerText = "Begin";
    //set ship size
    currentShipSize = getShipSize(evt.target.parentNode);
}

function placeShipsOnBoard() {
    if (!currentShipSize) return;
    playerGameboard;
}

function render() {
    placeShipsOnBoard();
    shipPlacement();
}
