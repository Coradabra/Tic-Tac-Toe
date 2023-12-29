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

  function checkWinner(token) {
    function horizontalAxis() {
      gameboard.forEach((row) => {
        let matches = 0;
        row.forEach((cell) => {
          if (cell === token) {
            matches++;
          }
        });
        if (matches == 3) {
          return true;
        }
      });
    }

    function verticalAxis() {
      for (let i = 0; i < columns; i++) {
        let matches = 0;
        gameboard.forEach((row) => {
          if (row[i] === token) {
            matches++;
          }
        });
        if (matches === 3) {
          return true;
        }
      }
    }

    function rightDiagonal() {
      let matches = 0;
      for (let i = 0; i < rows; i++) {
        if (gameboard[i][i] === token) {
          matches++;
        }
      }
      if (matches === 3) {
        return true;
      }
    }

    function leftDiagonal() {
      let matches = 0;
      for (let i = length(rows) - 1; i >= 0; i--) {
        if (gameboard[i][i] === token) {
          matches++;
        }
      }
      if (matches === 3) {
        return true;
      }
    }

    if (
      horizontalAxis() ||
      verticalAxis() ||
      rightDiagonal() ||
      leftDiagonal()
    ) {
      return true;
    }
  }

  function markCell(cellRef, token) {
    gameboard[cellRef] = token;
  }

  return { gameboard, markCell };
}

function GameController() {
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

  const firstPlayer = createPlayer("Player One", "X");
  const secondPlayer = createPlayer("Player Two", "O");

  function turnCOntroller() {
    let firstPlayersTrun = true;

    function changeTurn() {
      firstPlayersTrun = !firstPlayersTrun;
    }
  }
}

function ViewController() {}

//[X, X, X]
//[O,O,O]
//[X,O,X]
