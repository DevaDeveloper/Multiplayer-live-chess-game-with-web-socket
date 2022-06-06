const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { join } = require("path");
app.use(cors());
const instanceOfBoardState = require("./TableConfig");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  },
});

const boardClass = new instanceOfBoardState();

const { currentBoardState, boardState } = boardClass;

boardClass.makeInstanceOfTheBoard();

// const completeGame = [];

let whitePlays = true;
let timeWhite = 5 * 60;
let timeBlack = 5 * 60;
const connectedUsers = [];
let joinedUsersCounter = 0;

const switchPieces = () => {
  currentBoardState[selectedSquares[1] - 1] =
    currentBoardState[selectedSquares[0] - 1];
  currentBoardState[selectedSquares[0] - 1] = null;

  checkForBoardSelectValidity();
  whitePlays = !whitePlays;
};

const checkForBoardSelectValidity = () => {
  boardState.forEach((square) => {
    if (square.selected === true) {
      console.log(square);
      return (square.selected = false);
    }
  });
};

let selectedSquaresCounter = 0;
const selectedSquares = [];

const changeBoardData = (sqr) => {
  boardState.forEach((square) => {
    if (square.squarePlace === sqr) {
      square.selected = !square.selected;
      selectedSquaresCounter++;
      selectedSquares.push(sqr);
      console.log(selectedSquaresCounter);
      console.log(selectedSquares[0], selectedSquares[1]);
      if (selectedSquaresCounter === 2) {
        let firstSelectedPiece = currentBoardState[selectedSquares[0] - 1];
        if (
          currentBoardState[selectedSquares[0] - 1] === "B_PIJUN" &&
          selectedSquares[0] - selectedSquares[1] <= 16 &&
          currentBoardState[selectedSquares[1] - 1] !== "B_PIJUN"
        ) {
          switchPieces();
        } else if (
          (currentBoardState[selectedSquares[0] - 1] === "B_PIJUN" &&
            selectedSquares[0] - selectedSquares[1] >= 16) ||
          (currentBoardState[selectedSquares[0] - 1] === "B_PIJUN" &&
            currentBoardState[selectedSquares[1] - 1] === "B_PIJUN")
        ) {
          checkForBoardSelectValidity();
        } else if (firstSelectedPiece === "B_TOP" && whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "B_SKAKAC" && whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "B_LOVAC" && whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "B_DAMA" && whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "B_KRALJ" && whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "c_pijun" && !whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "c_skakac" && !whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "c_lovac" && !whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "c_dama" && !whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "c_kralj" && !whitePlays) {
          switchPieces();
        } else if (firstSelectedPiece === "c_top" && !whitePlays) {
          switchPieces();
        } else checkForBoardSelectValidity();

        console.log(currentBoardState);
        selectedSquaresCounter = 0;
        selectedSquares.pop();
        selectedSquares.pop();
      }
    }
  });
  console.log(selectedSquaresCounter, selectedSquares);

  return boardState;
};

io.on("connection", (socket) => {
  console.log(`Player Connected: ${socket.id}`);

  socket.on("join_game", (room) => {
    socket.join(room);
    console.log(`Player with ID: ${socket.id} joined game: ${room}`);
    connectedUsers.push(socket.id);
    joinedUsersCounter++;
    console.log(joinedUsersCounter);

    console.log(connectedUsers);
    io.in(room).emit("receive_board", {
      boardState,
      currentBoardState,
      whitePlays,
      timeWhite,
      timeBlack,
      connectedUsers,
      joinedUsersCounter,
    });
    if (connectedUsers.length === 2) {
      connectedUsers.pop();
      connectedUsers.pop();
    }
    if (joinedUsersCounter === 2) {
      joinedUsersCounter = 0;
    }
  });

  socket.on("send_move", (data) => {
    console.log(`CLICKED SQUARE IS ${data.movePlace}`);
    changeBoardData(data.movePlace);
    io.in(data.room).emit("receive_move", {
      boardState,
      currentBoardState,
      whitePlays,
    });
    console.log(`sent to ${data.room}`);
  });

  socket.on("disconnect", () => {
    console.log("Player Disconnected", socket.id);
  });
});

server.listen(5000, () => {
  console.log("SERVER RUNNING ON PORT 5000");
  console.log("SERVER RUNNING ON PORT 5000");
  console.log("SERVER RUNNING ON PORT 5000");
});
