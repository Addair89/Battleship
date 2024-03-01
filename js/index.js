/*----- constants -----*/

/*----- app's state (variables) -----*/
let turn;
let shipSelected;
let playerShipData;
let computerShipData;
let shipsPlaced;
let computerShipsPlaced;
let lastHit;
let nextShot;
let prevShot;
let prevShotCount;
let avaliableChoices;
let pBoard;
let cBoard;
let messageBox;

/*----- cached element references -----*/
const mainEl = document.querySelector("#game");
const mainMsgEl = document.querySelector(".main-message");
const gameMsgEl = document.querySelector(".game-message");
const startGameBtn = document.querySelector(".start-game-btn");
const playerBoardAnimatedCells = document.querySelectorAll(".animate");
const computerBoardAnimatedCells = document.querySelectorAll(".animate-c");
const ships = document.querySelectorAll(".ships > div");
const playerGameboard = document.getElementById("player-game-board");
const computerGameBoard = document.getElementById("computer-game-board");
const shootingMsg = document.querySelector(".ships-header");

/*----- functions -----*/
function init() {
    turn = null;
    shipSelected = null;
    prevShotCount = 4;
    messageBox = false;
    avaliableChoices = [];
    shipsPlaced = [];
    computerShipsPlaced = [];
    prevHit = "";
    nextHit = "";
    lastHit = "";
    playerShipData = {
        aircraft: { name: "aircraft", size: 5, location: [] },
        battleship: { name: "battleship", size: 4, location: [] },
        submarine: { name: "submarine", size: 3, location: [] },
        destroyer: { name: "destroyer", size: 3, location: [] },
        cruiser: { name: "cruiser", size: 2, location: [] },
    };
    computerShipData = {
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
    gameMsgEl.textContent = "Place your ships. Then hit Begin";
    mainMsgEl.textContent =
        "Click the ship below, then choose a tile to place your ship";
    startGameBtn.classList.toggle("hidden");
    document.querySelector("#ships-to-place").classList.toggle("hidden");
    playerBoardAnimatedCells.forEach((el) => {
        el.classList.remove("flashing-v2");
        el.classList.remove("flashing-v1");
    });
    document.querySelector(".your-board").classList.remove("hidden");
    document
        .getElementById("begin-game")
        .addEventListener("click", handleBeginGame);
    createComputerAvailableChoices();
    mainEl.classList.remove("hidden");
    mainEl.classList.add("show-right");
}

function createComputerAvailableChoices() {
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            let stringToPush = `c${i}r${j}`;
            avaliableChoices.push(stringToPush);
        }
    }
}

//----------------Setting the ship selcted----------//
function setShipSelected(evt) {
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
    if (openSpacesNorth === -1) {
        highLightVerticleSpaces(selectedTileId, ship, true);
    }
    if (openSpacesWest === -1) {
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
        gameMsgEl.innerText = `Not enough space for ${ship.name} there`;
        return;
    }
    //this checks for ships in east direction
    let range = [];
    while (startingElWestEast >= endingElWest) {
        range.push(pBoard[startingElWestEast][selectedTileId[3]]);
        startingElWestEast--;
    }
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
    let startingEl = Number(tileId[1]);
    let endingEl = add ? startingEl - shipSize + 1 : startingEl + 1 - shipSize;
    let color = add ? "green" : "white";
    if (endingEl < -1) return;
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
    let startingEl = Number(tileId[3]);
    let endingEl = startingEl + shipSize;
    let color = add ? "green" : "white";
    if (startingEl + shipSize > 10) return;
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
    highlightWestSpaces(tileId, ship, false);
    highLightVerticleSpaces(tileId, ship, false);
    messageBox = false;
}

function handleConfirmationBtn(ship, tileId, direction, confirmMessageBox) {
    confirmMessageBox.classList.toggle("hidden");
    gameMsgEl.textContent = "Select another Ship to place";
    messageBox = false;
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
    if (direction === "north") {
        confirmNorth(startingEl, ship, tileId, confirmMessageBox);
    }
    if (direction === "west") {
        confirmWest(startingEl, ship, tileId, confirmMessageBox);
    }
    shipSelected = "";
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
    if (shipsPlaced.length === 5) {
        document.getElementById("begin-game").classList.toggle("hidden");
        shootingMsg.textContent = "";
    }
}

function confirmNorth(startingEl, ship, tileId, confirmMessageBox) {
    confirmMessageBox.remove();
    let shipArr = ship.name.split("");
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

    if (shipsPlaced.length === 5) {
        document.getElementById("begin-game").classList.toggle("hidden");
        shootingMsg.textContent = "";
    }
}

function handleBeginGame() {
    document.getElementById("begin-game").classList.add("hide-left");
    setTimeout(() => {
        document.getElementById("begin-game").classList.toggle("hidden");
    }, 500);

    document.getElementById("ships-to-place").classList.toggle("hidden");
    computerRandomShipPlacement();
    mainMsgEl.textContent = "Time to start shooting!!!!";
    gameMsgEl.textContent = "Its your turn, good luck sailor!";
    shootingMsg.textContent = "";
    //1 equals player -1 equals computer
    turn = 1;
    startShooting(turn);
}

function computerRandomShipPlacement() {
    let computerShipsCopy = {
        ...computerShipData,
    };
    let direction;
    while (Object.keys(computerShipsCopy).length > 0) {
        for (ship in computerShipsCopy) {
            let col = Math.floor(Math.random() * 9) + 1;
            let row = Math.floor(Math.random() * 9) + 1;
            let startingCell = `cc${col}r${row}`;
            let spacesNorth = checkComputerSpacesNorth(ship, startingCell);
            let spacesWest = checkComputerSpacesWest(ship, startingCell);
            if (spacesNorth === 1 || spacesWest === 1) {
                direction = decideComputerShipDirection(
                    spacesNorth,
                    spacesWest
                );
                delete computerShipsCopy[ship];
                placeComputerShip(ship, startingCell, direction);
            }
        }
    }
}

function decideComputerShipDirection(spacesNorth, spacesWest) {
    //1 will equal north and 2 will equal West
    let direction;
    //if both are 1 then pick a random direction
    if (spacesNorth && spacesWest) {
        let num = Math.floor(Math.random() * (3 - 1) + 1);
        direction = num;
    }
    //if only one is 1 then go that direction
    if (spacesNorth && spacesWest === -1) {
        direction = 1;
    } else if (spacesNorth === -1 && spacesWest) {
        direction = 2;
    }
    return direction;
}
function checkComputerSpacesWest(ship, startingCell) {
    let shipSize = computerShipData[ship].size;
    let startingCellArr = startingCell.split("");
    let row = Number(startingCellArr[4]);
    let col = Number(startingCellArr[2]);
    let count = col;
    let avaliableSpaces;
    //Checks if board length can fit ship to left
    if (startingCellArr[2] - shipSize - 1 < 0) {
        avaliableSpaces = -1;
    }
    //check if board cells contain ship already left
    while (count > shipSize) {
        if (cBoard[count][row] === 1) {
            avaliableSpaces = -1;
            break;
        }
        avaliableSpaces = 1;
        count--;
    }
    return avaliableSpaces;
}

function checkComputerSpacesNorth(ship, startingCell) {
    let shipSize = computerShipData[ship].size;
    let startingCellArr = startingCell.split("");
    let col = Number(startingCellArr[2]);
    let row = Number(startingCellArr[4]);
    let count = 0;
    let avaliableSpaces;
    //checks if board length can fit ship up
    if (row + shipSize - 1 > cBoard[row].length - 1) {
        avaliableSpaces = -1;
        return avaliableSpaces;
    }
    //check if board cells contain ship already up
    while (count < shipSize) {
        if (cBoard[col][row + count] === 1) {
            avaliableSpaces = -1;
            break;
        }
        avaliableSpaces = 1;
        count++;
    }
    return avaliableSpaces;
}

function placeComputerShip(ship, startingCell, direction) {
    //direction: 1 means north and 2 means west. will need to add the value of one in the cboard arrays, and the values of the cells in the computerShipsData object.

    let row = Number(startingCell[4]);
    let col = Number(startingCell[2]);

    if (direction === 1) {
        let count = 0;
        while (count < computerShipData[ship].size) {
            cBoard[col][row + count] = 1;
            computerShipData[ship].location.push(`cc${col}r${row + count}`);
            document.getElementById(
                `cc${col}r${row + count}`
            ).style.background = "white";
            count++;
        }
    }
    if (direction === 2) {
        let count = 0;
        while (computerShipData[ship].size > count) {
            cBoard[col - count][row] = 1;
            computerShipData[ship].location.push(`cc${col - count}r${row}`);
            document.getElementById(
                `cc${col - count}r${row}`
            ).style.background = "white";

            count++;
        }
    }
}

function startShooting(turn) {
    let computerShipsSunk = checkComputerShipsSunk();
    let playerShipsSunk = checkPlayerShipsSunk();
    let winner = checkForWiner();
    if (winner === 1 || winner === -1) {
        return displayWinnerEndGame(winner);
    }
    document.querySelector(".your-board").classList.remove("margin-right");
    if (turn) {
        computerBoardAnimatedCells.forEach((el) => {
            el.classList.remove("flashing-v1");
            el.classList.remove("flashing-v2");
        });
        document.querySelector(".your-board").textContent =
            "Your turn to shoot";
        mainMsgEl.textContent = "Save the world and kill the AI traitors!!!";
        gameMsgEl.textContent = "Please dont miss...";
        playerGameboard.classList.add("hidden");
        playerGameboard.classList.remove("show-right");
        computerGameBoard.classList.remove("hidden");
        computerGameBoard.classList.add("show-right");
        computerGameBoard.addEventListener("click", handlePlayerShot);
        if (computerShipsSunk.length > 0) {
            document
                .querySelector(".ships-to-place")
                .classList.remove("hidden");

            document.querySelector(
                ".ships-to-place > .ships-header"
            ).textContent = "You Sunk the Computers: ";

            document.querySelector(
                ".ships-to-place > .ships"
            ).textContent = computerShipsSunk.join(" and ");
        }
    }
    if (turn === -1) {
        if (playerShipsSunk.length === 0) {
            document.querySelector(".ships-to-place").classList.add("hidden");
        } else {
            document
                .querySelector(".ships-to-place")
                .classList.remove("hidden");

            document.querySelector(
                ".ships-to-place > .ships-header"
            ).textContent = "You Sunk the Computer's: ";

            document.querySelector(
                ".ships-to-place > .ships"
            ).textContent = playerShipsSunk.join(" and ");
        }
        document.querySelector(".your-board").textContent = "Computers Turn";
        mainMsgEl.textContent = "All Humans must die!!!!";
        gameMsgEl.textContent = "";
        computerGameBoard.classList.add("hidden");
        computerGameBoard.classList.remove("show-right");
        playerGameboard.classList.remove("hidden");
        playerGameboard.classList.add("show-right");
        handleComputerShot();
    }
}

function checkComputerShipsSunk() {
    let sunkShips = [];
    for (ship in computerShipData) {
        if (computerShipData[ship].location.length === 0) {
            sunkShips.push(ship);
        }
    }
    return sunkShips;
}

function checkPlayerShipsSunk() {
    let sunkShips = [];
    for (ship in playerShipData) {
        if (playerShipData[ship].location.length === 0) {
            sunkShips.push(ship);
        }
    }
    return sunkShips;
}

function checkForWiner() {
    let playerWin = [];
    let computerWin = [];
    cBoard.forEach((el) => {
        el.forEach((el) => {
            if (el === 1) playerWin.push(el);
        });
    });
    pBoard.forEach((el) => {
        el.forEach((el) => {
            if (el === 1) computerWin.push(el);
        });
    });
    if (playerWin.length === 0) return 1;
    if (computerWin.lenght === 0) return -1;
    return "keep playing";
}

function handleComputerShot() {
    let selection = Math.floor(Math.random() * avaliableChoices.length);
    let timeLeft = 1;
    let hit = false;
    let indexToRemove;
    let shipName;
    let randomCell;
    let timer = setInterval(function() {
        gameMsgEl.textContent = `Computer Shooting in - ${timeLeft}...`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            randomCell = avaliableChoices[selection];
            prevShot = randomCell;
            let randomCellArr = randomCell.split("");
            makeShot(randomCellArr);
        }
        timeLeft--;
    }, 1000);

    function makeShot(cellArr) {
        avaliableChoices.splice(selection, 1);
        for (ship in playerShipData) {
            if (playerShipData[ship].location.includes(randomCell)) {
                shipName = ship;
                hit = true;
                indexToRemove = playerShipData[ship].location.indexOf(
                    randomCell
                );
            }
        }
        if (hit) {
            lastHit = randomCell;
            prevShotCount = prevShotCount;
            document.getElementById(randomCell).classList.add("hit");
            playerShipData[shipName].location.splice(indexToRemove, 1);
            pBoard[cellArr[1]][cellArr[3]] = 0;
            gameMsgEl.textContent =
                "Computer Hit. The time for humans is at an end";
        }
        if (!hit) {
            if (prevShotCount === 1) prevHit = "";
            document.getElementById(randomCell).style.backgroundColor = "gray";
            gameMsgEl.textContent = "Computer Missed, must be a bug!";
        }
    }

    setTimeout(function() {
        turn = 1;
        startShooting(turn);
    }, 3000);
}

function handlePlayerShot(evt) {
    if (evt.target.classList.length > 0) {
        gameMsgEl.textContent = "Cant shoot there!!! Aim and fire again!!!";
    }
    let shot = evt.target.id;
    let shotArr = shot.split("");
    let hit = false;
    let indexToRemove;
    let elToStyle;
    let shipName;

    for (ship in computerShipData) {
        elToStyle = document.getElementById(shot);
        if (computerShipData[ship].location.includes(shot)) {
            shipName = ship;
            hit = true;
            indexToRemove = computerShipData[ship].location.indexOf(shot);
        }
    }
    if (hit) {
        elToStyle.style.background = "red";
        computerShipData[shipName].location.splice(indexToRemove, 1);
        cBoard[shotArr[2]][shotArr[4]] = 0;
        gameMsgEl.textContent = "Good hit sailor!! Kill the evil AI";
    }
    if (!hit) {
        elToStyle.style.background = "gray";
        gameMsgEl.textContent = "If you keep missing, we will all die";
    }
    let timeLeft = 1;
    let timer = setInterval(function() {
        if (timeLeft <= 0) {
            turn = -1;
            clearInterval(timer);
            startShooting(turn);
        }
        gameMsgEl.textContent = `Computer's turn in - ${timeLeft}...`;
        timeLeft--;
    }, 1000);
}

function displayWinnerEndGame(winner) {
    let timeLeft = 2;
    let timer = setInterval(function() {
        timeLeft--;
        if (timeLeft <= 0) clearInterval(timer);
        mainEl.classList.add("hidden");
        let winnerMsgBox = document.querySelector(".winner-msg-box");
        winnerMsgBox.classList.remove("hidden");
        if (winner === 1) {
            mainMsgEl.textContent =
                "Thank Goodness You've Defeated The Evil AI";
            gameMsgEl.textContent = "You Won!!!";
            document.querySelector(".your-board").textContent = "Play Again?";
            document
                .querySelector(".your-board")
                .classList.remove("margin-right");
        }
    }, 1000);
}

/*----- event listeners -----*/
startGameBtn.addEventListener("click", init);
ships.forEach((ship) => ship.addEventListener("click", setShipSelected));
playerGameboard.addEventListener("click", placeShip);
