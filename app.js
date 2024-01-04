const gameTileList = document.querySelectorAll(".gameTile");
const gameTiles = [...gameTileList];

function Gameboard() {
  const gameboard = [];
  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    const rowArray = [];
    for (let i = 0; i < columns; i++) {
      rowArray.push("");
    }
    gameboard.push(rowArray);
  }

  const getBoard = () => gameboard;

  function convertCellRef(cellRef) {
    let row = 0;
    if (cellRef === 0) {
      row = 0;
    } else {
      row = Math.floor(cellRef / 3);
    }
    const cell = cellRef % 3;

    return [row, cell];
  }

  const { updateBoardDisplay } = ViewController();

  function markCell(cellRef, token) {
    const [row, cell] = convertCellRef(cellRef);
    if (gameboard[row][cell] !== "") {
      return false;
    }
    gameboard[row][cell] = token;
    updateBoardDisplay(gameboard);
    return true;
  }

  return { getBoard, markCell };
}

//////////////////////////////////////////////////////////////////////////////////////

function GameController() {
  const { getBoard, markCell } = Gameboard();
  const { updateTurnDisplay, updateBoardDisplay } = ViewController();

  function createPlayer(name, token) {
    let score = 0;

    function increaseScore() {
      score++;
    }

    const getName = () => name;
    const getToken = () => token;
    const getScore = () => score;

    return { getName, getToken, getScore, increaseScore };
  }

  const playerOne = createPlayer("Player One", "X");
  const playerTwo = createPlayer("Player Two", "O");

  let activePlayer = playerOne;

  const getActiveToken = () => activePlayer.getToken();

  function changePlayersTurn() {
    if (activePlayer === playerOne) {
      activePlayer = playerTwo;
    } else {
      activePlayer = playerOne;
    }
    console.log(activePlayer.getName());
    updateTurnDisplay();
  }

  gameTiles.forEach((tile) => {
    const cellRef = gameTiles.indexOf(tile);
    tile.addEventListener("click", () => {
      const token = getActiveToken();
      markCell(cellRef, token) ? changePlayersTurn() : null;
    });
  });

  return;
}

/////////////////////////////////////////////////////////////////////////////////////////

function ViewController() {
  const playerOneDisplay = document.querySelector(".player-one");
  const playerTwoDisplay = document.querySelector(".player-two");

  function updateTurnDisplay() {
    playerOneDisplay.classList.toggle("currentTurn");
    playerTwoDisplay.classList.toggle("currentTurn");
  }

  function updateBoardDisplay(gameboard) {
    const linearGameboard = [...gameboard[0], ...gameboard[1], ...gameboard[2]];
    let i = 0;
    gameTiles.forEach((tile) => {
      tile.textContent = linearGameboard[i];
      i++;
    });
  }

  return { updateTurnDisplay, updateBoardDisplay };
}

///////////////////////////////////////////////////////////////////////////////////

GameController();
// function checkWinner(token) {
//   function horizontalAxis() {
//     gameboard.forEach((row) => {
//       let matches = 0;
//       row.forEach((cell) => {
//         if (cell === token) {
//           matches++;
//         }
//       });
//       if (matches == 3) {
//         return true;
//       }
//     });
//   }

//   function verticalAxis() {
//     for (let i = 0; i < columns; i++) {
//       let matches = 0;
//       gameboard.forEach((row) => {
//         if (row[i] === token) {
//           matches++;
//         }
//       });
//       if (matches === 3) {
//         return true;
//       }
//     }
//   }

//   function rightDiagonal() {
//     let matches = 0;
//     for (let i = 0; i < rows; i++) {
//       if (gameboard[i][i] === token) {
//         matches++;
//       }
//     }
//     if (matches === 3) {
//       return true;
//     }
//   }

//   function leftDiagonal() {
//     let matches = 0;
//     for (let i = length(rows) - 1; i >= 0; i--) {
//       if (gameboard[i][i] === token) {
//         matches++;
//       }
//     }
//     if (matches === 3) {
//       return true;
//     }
//   }

//   if (
//     horizontalAxis() ||
//     verticalAxis() ||
//     rightDiagonal() ||
//     leftDiagonal()
//   ) {
//     return true;
//   }
// }

//
