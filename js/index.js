/*----- constants -----*/

/*----- app's state (variables) -----*/
let turn;
let shipSelected;
let playerShipData;
let shipsPlaced;
let pBoard;
let cboard;
let messageBox;

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
    messageBox = false;
    shipsPlaced = [];
    playerShipData = {
        aircraft: { name: "aircraft", size: 5, location: [] },
        battleship: { name: "battleship", size: 4, location: [] },
        submarine: { name: "submarine", size: 3, location: [] },
        destroyer: { name: "destroyer", size: 3, location: [] },
        cruiser: { name: "cruiser", size: 2, location: [] },
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
    startGameBtn.classList.toggle("hidden");
    document.getElementById("begin-game").classList.toggle("hidden");
    document
        .getElementById("begin-game")
        .addEventListener("click", handleBeginGame);
}

//----------------Setting the ship selcted----------//
function setShipSelected(evt) {
    console.log(evt);
    if (messageBox) return;
    //remove background from all ships
    ships.forEach((ship) => {
        if (!shipsPlaced.includes(ship)) {
            ship.classList.remove("selected-ship");
        }
    });

    //setting the shipSelected variable to use throughout other functions
    if (evt.target.tagName === "P") {
        shipSelected = evt.target.parentNode.id;
    } else if (evt.target.tagName === "DIV") {
        shipSelected = evt.target.id;
    }
    console.log(shipSelected);
    //setting tyling class for selected ship
    if (!shipsPlaced.includes(shipSelected)) {
        if (evt.target.tagName === "P") {
            evt.target.parentNode.classList.add("selected-ship");
        } else if (evt.target.tagName === "DIV") {
            evt.target.classList.add("selected-ship");
        }
    }
}

//-----------Will need to check the board, to see if enough spaces above, and update the board arrays, and hilight the placement spots. evt.target gives me the div with the col# and row# ----------//
function placeShip(evt) {
    if (messageBox) return;
    let selectedTileEl = evt.target;
    if (shipSelected.length <= 0) {
        gameMsgEl.textContent = "Place choose a ship first";
        return;
    }
    let ship = playerShipData[shipSelected];
    //this lets me get the starting point to count spaces from
    let selectedTileId = evt.target.id.split("");
    console.log(selectedTileId);
    let startingElNorthSouth = Number(selectedTileId[3]);
    let startingElWestEast = Number(selectedTileId[1]);
    let endingElNorth = startingElNorthSouth + ship.size;
    let endingElWest = startingElWestEast - ship.size + 1;
    openRangeNorth(startingElNorthSouth, selectedTileId, ship, endingElNorth);

    let openSpacesNorth = openRangeNorth(
        startingElNorthSouth,
        selectedTileId,
        ship,
        endingElNorth
    );
    let openSpacesWest = openRangeWest(
        startingElWestEast,
        selectedTileId,
        ship,
        endingElWest
    );
    console.log(openSpacesWest);
    if (openSpacesNorth === -1) {
        selectedTileEl.style.backgroundColor = "green";
        highLightVerticleSpaces(selectedTileId, ship, true);
    }
    if (openSpacesWest === -1) {
        selectedTileEl.style.backgroundColor = "green";
        highlightWestSpaces(selectedTileId, ship, true);
    }
    showConfirmMessage(ship, selectedTileId, openSpacesWest, openSpacesNorth);
}

function openRangeWest(startingElWestEast, selectedTileId, ship, endingElWest) {
    //script to count avaliable spaces to left(west).
    //this checks if clicked spot is already taken
    if (pBoard[startingElWestEast][selectedTileId[3]] === 1) {
        gameMsgEl.innerText = `Not enough space for ${ship.name} there`;
        return;
    }
    //this checks if ship is going to go off the board
    if (endingElWest < 0) {
        console.log("this ran open ranges west");
        gameMsgEl.innerText = `Not enough space for ${ship.name} there`;
        return;
    }
    //this checks for ships in east direction
    let range = [];
    while (startingElWestEast >= endingElWest) {
        range.push(pBoard[startingElWestEast][selectedTileId[3]]);
        startingElWestEast--;
    }
    console.log(range);
    //if the range has a 1, that means a ship is there, cannot place new ship in that range
    if (range.includes(1)) {
        gameMsgEl.innerText = `Not enough space for ${ship.name} there`;
        return;
    }

    return range.indexOf(1);
}

function openRangeNorth(
    startingElNorthSouth,
    selectedTileId,
    ship,
    endingElNorth
) {
    //script to count avaliable spaces above(north).
    if (pBoard[selectedTileId[1]][startingElNorthSouth] === 1) {
        gameMsgEl.innerText = `Not enough space for ${ship.name} there`;
        return;
    }
    let range = pBoard[selectedTileId[1]].slice(
        startingElNorthSouth,
        endingElNorth
    );
    if (range.includes(1)) {
        gameMsgEl.innerText = `Not enough space for ${ship.name} there`;
        return;
    }
    if (
        startingElNorthSouth + ship.size - 1 >
        pBoard[startingElNorthSouth].length - 1
    ) {
        gameMsgEl.innerText = `Not enough space for ${ship.name} there`;
        return;
    }
    return range.indexOf(1);
}

function highlightWestSpaces(tileId, ship, add) {
    let shipSize = ship.size;
    let startingEl = add ? Number(tileId[1]) : Number(tileId[1]) - 1;
    console.log(startingEl);
    let endingEl = startingEl - shipSize + 1;
    console.log(endingEl);
    let color = add ? "green" : "white";
    while (startingEl >= endingEl) {
        if (endingEl === -1) endingEl += 1;
        document.getElementById(
            `c${startingEl}r${tileId[3]}`
        ).style.backgroundColor = color;
        startingEl--;
    }
    if (add) {
        messageBox = true;
    }
}

function highLightVerticleSpaces(tileId, ship, add) {
    let shipSize = ship.size;
    let startingEl = add ? Number(tileId[3]) : Number(tileId[3]) + 1;
    let endingEl = startingEl + shipSize;
    let color = add ? "green" : "white";
    while (startingEl < endingEl) {
        document.getElementById(
            `c${tileId[1]}r${startingEl}`
        ).style.backgroundColor = color;
        startingEl++;
    }

    if (add) {
        messageBox = true;
    }
}

function showConfirmMessage(ship, tileId, openSpacesWest, openSpacesNorth) {
    console.log("Ran");
    if (messageBox) {
        let confirmMessageBox = document.createElement("div");
        let confirmMessage = document.createElement("p");
        let confirmBtnNorth = document.createElement("button");
        let confirmBtnWest = document.createElement("button");
        let placeAgainBtn = document.createElement("button");
        confirmBtnNorth.innerText = "Place North";
        confirmBtnNorth.id = "north-btn";
        confirmBtnWest.innerText = "Place West";
        placeAgainBtn.innerText = "Cancel";
        confirmMessage.innerText = `Are you sure you want to place you ${ship.name} here?`;
        confirmMessageBox.appendChild(confirmMessage);
        if (openSpacesNorth === -1) {
            confirmMessageBox.appendChild(confirmBtnNorth);
        }
        if (openSpacesWest) {
            confirmMessageBox.appendChild(confirmBtnWest);
        }
        confirmMessageBox.appendChild(placeAgainBtn);
        confirmMessageBox.classList.add("confirm-message-box");
        document.body.appendChild(confirmMessageBox);

        confirmBtnNorth.addEventListener("click", () => {
            handleConfirmationBtn(ship, tileId, "north", confirmMessageBox);
        });
        confirmBtnWest.addEventListener("click", () => {
            handleConfirmationBtn(ship, tileId, "west", confirmMessageBox);
        });
        placeAgainBtn.addEventListener("click", () => {
            handleCancelBtn(confirmMessageBox, tileId, ship);
        });
    }
}

function handleCancelBtn(confirmMessageBox, tileId, ship) {
    confirmMessageBox.remove();
    highLightVerticleSpaces(tileId, ship, false);
    highlightWestSpaces(tileId, ship, false);
    messageBox = false;
}

function handleConfirmationBtn(ship, tileId, direction, confirmMessageBox) {
    confirmMessageBox.classList.toggle("hidden");
    gameMsgEl.textContent = "Select another Ship to place";
    messageBox = false;
    console.log(tileId);
    console.log(direction);
    //remove ship option from dom if placed
    shipsPlaced.push(ship.name);
    ships.forEach((el) => {
        if (el.id === ship.name) {
            el.remove();
        }
    });

    //will need to check the direction user wants to place ship, update dom to reflect choice, update shipdata location and pboard arrays, remove other highlighting from board.
    let startingEl =
        direction === "north"
            ? Number(tileId[3])
            : direction === "west"
            ? Number(tileId[1])
            : Number(tileId[3]);
    console.log(startingEl);
    if (direction === "north") {
        confirmNorth(startingEl, ship, tileId, confirmMessageBox);
    }
    if (direction === "west") {
        confirmWest(startingEl, ship, tileId, confirmMessageBox);
    }
    shipSelected = "";

    console.log(pBoard);
    console.log(playerShipData);
}

function confirmWest(startingEl, ship, tileId, confirmMessageBox) {
    confirmMessageBox.remove();
    let shipArr = ship.name.split("");
    highLightVerticleSpaces(tileId, ship, false);
    let endingEl = startingEl - ship.size;
    let count = 0;
    while (startingEl > endingEl) {
        pBoard[startingEl][tileId[3]] = 1;
        playerShipData[ship.name].location.push(`c${startingEl}r${tileId[3]}`);
        let shipId = playerShipData[ship.name].location[count];
        document.getElementById(shipId).classList.add("highlight");
        document.getElementById(shipId).textContent = shipArr[0];
        startingEl--;
        count++;
    }
}

function confirmNorth(startingEl, ship, tileId, confirmMessageBox) {
    confirmMessageBox.remove();
    let shipArr = ship.name.split("");
    console.log("ran confimrnorth");
    highlightWestSpaces(tileId, ship, false);
    let endingEl = startingEl + ship.size;
    let count = 0;
    while (startingEl < endingEl) {
        pBoard[tileId[1]][startingEl] = 1;
        playerShipData[ship.name].location.push(`c${tileId[1]}r${startingEl}`);
        let shipId = playerShipData[ship.name].location[count];
        document.getElementById(shipId).classList.add("highlight");
        document.getElementById(shipId).classList.add("highlight");
        document.getElementById(shipId).textContent = shipArr[0];
        startingEl++;
        count++;
    }
}

function handleBeginGame() {
    if (shipsPlaced.length !== 5) {
        console.log(shipsPlaced);
        gameMsgEl.textContent = "Place All ships before beginning game!!!";
        return;
    }
    console.log("Begging Game!");
}

/*----- event listeners -----*/
startGameBtn.addEventListener("click", init);
console.log(ships);
ships.forEach((ship) => ship.addEventListener("click", setShipSelected));
playerGameboard.addEventListener("click", placeShip);
