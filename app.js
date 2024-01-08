const gameTileList = document.querySelectorAll(".gameTile");
const gameTiles = [...gameTileList];

function Gameboard() {
  const { updateBoardDisplay } = ViewController();
  let gameboard = [];

  function resetBoard() {
    gameboard = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
      const rowArray = [];
      for (let i = 0; i < columns; i++) {
        rowArray.push("");
      }
      gameboard.push(rowArray);
    }
    updateBoardDisplay(gameboard);
  }

  resetBoard();

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

  function markCell(cellRef, token) {
    const [row, cell] = convertCellRef(cellRef);
    if (gameboard[row][cell] !== "") {
      return false;
    }
    gameboard[row][cell] = token;
    updateBoardDisplay(gameboard);
    return true;
  }

  return { getBoard, markCell, resetBoard };
}

//////////////////////////////////////////////////////////////////////////////////////

function GameController() {
  const { getBoard, markCell, resetBoard } = Gameboard();
  const {
    updateTurnDisplay,
    displayWin,
    updateScoreDisplays,
    toggleBannerMessage,
    updateNames,
  } = ViewController();

  const modal = document.querySelector(".modal");
  const modalForm = document.querySelector(".modal>form");
  const resetBtn = document.querySelector(".reset");

  let playingRound = true;
  let playerOne = null;
  let playerTwo = null;
  let activePlayer = playerOne;

  resetBtn.addEventListener("click", () => {
    resetGame();
    playerOne = null;
    playerTwo = null;
    updateScoreDisplays();
    modal.showModal();
  });

  modalForm.addEventListener("submit", (event) => {
    const formInputs = [...event.target];
    const playerData = formInputs.map((data) => data.value);
    playerOne = createPlayer(playerData[0], playerData[1]);
    playerTwo = createPlayer(playerData[2], playerData[3]);
    activePlayer = playerOne;
    updateNames(playerOne, playerTwo);
    console.log(event);
  });

  gameTiles.forEach((tile) => {
    const cellRef = gameTiles.indexOf(tile);
    tile.addEventListener("click", () => {
      const token = activePlayer.getToken();
      if (playingRound) {
        const procceed = markCell(cellRef, token);
        checkWin();
        procceed && changePlayersTurn();
      }
    });
  });

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

  function resetGame() {
    resetBoard();
    playingRound = true;
  }

  function changePlayersTurn() {
    if (!playingRound) {
      return;
    }

    if (activePlayer === playerOne) {
      activePlayer = playerTwo;
    } else {
      activePlayer = playerOne;
    }
    updateTurnDisplay();
  }

  function checkWin() {
    const board = getBoard();
    const linearBoard = [...board[0], ...board[1], ...board[2]];
    const token = activePlayer.getToken();
    let winningCells = null;

    // Horizontal Check
    for (let i = 0; i < 3; i++) {
      const horizontalCheck = [board[i][0], board[i][1], board[i][2]].filter(
        (cell) => cell === token
      );
      horizontalCheck.length === 3
        ? (winningCells = [i * 3, i * 3 + 1, i * 3 + 2])
        : null;
    }

    // Vertical Check
    for (let i = 0; i < 3; i++) {
      const verticalCheck = [board[0][i], board[1][i], board[2][i]].filter(
        (cell) => cell === token
      );
      verticalCheck.length === 3 ? (winningCells = [i, i + 3, i + 6]) : null;
    }

    // Diagonal Checks
    const rightDiagonalCells = [board[0][0], board[1][1], board[2][2]].filter(
      (cell) => cell === token
    );
    rightDiagonalCells.length === 3 ? (winningCells = [0, 4, 8]) : null;

    const leftDiagonalCells = [board[0][2], board[1][1], board[2][0]].filter(
      (cell) => cell === token
    );
    leftDiagonalCells.length === 3 ? (winningCells = [2, 4, 6]) : null;

    if (winningCells) {
      playingRound = false;
      displayWin(winningCells);
      toggleBannerMessage(activePlayer.getName(), resetGame);
      activePlayer.increaseScore();
      updateScoreDisplays(playerOne.getScore(), playerTwo.getScore());
    } else if (linearBoard.filter((cell) => cell === token).length > 4) {
      playingRound = false;
      toggleBannerMessage("No one", resetGame);
      return;
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////

function ViewController() {
  const playerOneDisplay = document.querySelector(".player-one");
  const playerTwoDisplay = document.querySelector(".player-two");
  const playerOneName = document.querySelector(".player-one>h3");
  const playerTwoName = document.querySelector(".player-two>h3");

  const scoreDisplays = [...document.querySelectorAll(".score")];
  const playerOneScore = scoreDisplays[0];
  const playerTwoScore = scoreDisplays[1];

  function updateNames(playerOne, playerTwo) {
    playerOneName.textContent = `${playerOne.getName()} - "${playerOne.getToken()}"`;
    playerTwoName.textContent = `${playerTwo.getName()} - "${playerTwo.getToken()}"`;
  }

  function updateTurnDisplay() {
    playerOneDisplay.classList.toggle("currentTurn");
    playerTwoDisplay.classList.toggle("currentTurn");
  }

  function updateBoardDisplay(gameboard) {
    const linearGameboard = [...gameboard[0], ...gameboard[1], ...gameboard[2]];
    let i = 0;
    gameTiles.forEach((tile) => {
      tile.textContent = linearGameboard[i];
      tile.classList.remove("winningTile");
      i++;
    });
  }

  function updateScoreDisplays(playerOne, playerTwo) {
    playerOneScore.textContent = playerOne;
    playerTwoScore.textContent = playerTwo;
  }

  function toggleBannerMessage(winningPlayer, playAgainCallBack) {
    const contentDiv = document.querySelector(".content");
    const bannerDisplay = document.querySelector(".message");
    if (bannerDisplay) {
      contentDiv.removeChild(bannerDisplay);
    } else {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");

      const messageP = document.createElement("p");
      messageP.textContent = `${winningPlayer} has won this round!`;
      messageDiv.appendChild(messageP);

      const messageBtn = document.createElement("button");
      messageBtn.textContent = "Play Again?";
      messageBtn.addEventListener("click", () => {
        playAgainCallBack();
        toggleBannerMessage();
      });
      messageDiv.appendChild(messageBtn);

      contentDiv.appendChild(messageDiv);
    }
  }

  function displayWin(winningCells) {
    winningCells.forEach((cellRef) =>
      gameTiles[cellRef].classList.add("winningTile")
    );
  }

  return {
    updateTurnDisplay,
    updateBoardDisplay,
    displayWin,
    updateScoreDisplays,
    toggleBannerMessage,
    updateNames,
  };
}

///////////////////////////////////////////////////////////////////////////////////

GameController();
