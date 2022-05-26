import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./Board.module.css";
import Square from "../Square/Square";
import { v4 as uuid } from "uuid";

// const socket = io.connect("http://localhost:5000");

const Board = () => {
  const [mySocket, setMySocket] = useState(null);
  const [clientBoardState, setClientBoardState] = useState();
  const [roomId, setRoomId] = useState(1);
  const [whiteClock, setWhiteClock] = useState(0);
  const [blackClock, setBlackClock] = useState(0);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [joinedUsersCounter, setJoinedUsersCounter] = useState(0);
  const [whitePlays, setWhitePlays] = useState(true);
  const [completeGameHistory, setCompleteGameHistory] = useState([]);

  // const [socketValue, setSocketValue] = useState();
  // const { globalBoardState } = clientBoardState;

  const allSquares = [];
  for (let i = 1; i <= 64; i++) {
    allSquares.push(i);
  }

  const joinGame = () => {
    if (mySocket) {
      setRoomId(1);
      mySocket.emit("join_game", roomId);
    }
    console.log(roomId);
  };

  useEffect(() => {
    if (!mySocket) {
      setMySocket(io.connect("http://localhost:5000"));
      console.log("USER CONNECTED");
    }
  }, []);

  useEffect(() => {
    if (mySocket && mySocket.connect) {
      mySocket.on("receive_board", (boardData) => {
        setClientBoardState(boardData);
        setWhiteClock(boardData.timeWhite);
        setBlackClock(boardData.timeBlack);
        setWhitePlays(boardData.whitePlays);
        setConnectedUsers((prevState) => [
          ...prevState,
          boardData.connectedUsers,
        ]);
        setJoinedUsersCounter(boardData.joinedUsersCounter);
        console.log(boardData.joinedUsersCounter);
      });
    }
  }, [mySocket, clientBoardState]);

  if (mySocket && mySocket.connect) {
    mySocket.on("receive_move", (boardData) => {
      setClientBoardState(boardData);

      // console.log(`board from server`);
      // console.log(boardData);
    });
  }

  useEffect(() => {
    const clockTicking = () => {
      // console.log(joinedUsersCounter);

      if (joinedUsersCounter === 2) {
        if (whiteClock === 0) {
          return alert(`BLACK WON!!! Time is up!`);
        } else if (blackClock === 0) {
          return alert(`WHITE WON!!! Time is up!`);
        }
        if (clientBoardState && clientBoardState.whitePlays) {
          setWhitePlays(true);
          setWhiteClock((prevState) => prevState - 1);
        } else {
          setWhitePlays(false);
          setBlackClock((prevState) => prevState - 1);
        }
      }
    };

    setTimeout(() => {
      clockTicking();
    }, 1000);
  }, [whiteClock, blackClock, connectedUsers, joinedUsersCounter]);

  return (
    <>
      <div>
        <button
          onClick={() => joinGame()}
          style={{
            background: "skyblue",
            border: "none",
            padding: "8px 12px",
            margin: "10px 0",
            cursor: "pointer",
          }}
        >
          Join Game
        </button>
        <p>
          Na potezu je:
          {clientBoardState && clientBoardState.whitePlays
            ? " Bijeli"
            : " Crni"}
        </p>
      </div>
      <div className={styles.boardHolder}>
        <div className={styles.blackClock}>
          <p
            className={`${
              clientBoardState && !clientBoardState.whitePlays
                ? styles.black_ticking
                : ""
            }`}
          >
            Black: {blackClock && blackClock} s
          </p>
        </div>
        <div className={styles.board}>
          {clientBoardState &&
            clientBoardState.boardState.map((square) => (
              <Square
                square={square}
                key={uuid()}
                socket={mySocket}
                room={roomId}
                globalBoardState={clientBoardState.currentBoardState}
              />
            ))}
        </div>
        <div className={styles.whiteClock}>
          <p
            // className={styles.white_ticking}
            className={`${
              clientBoardState && clientBoardState.whitePlays
                ? styles.white_ticking
                : ""
            }`}
          >
            White: {whiteClock && whiteClock} s{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default Board;
