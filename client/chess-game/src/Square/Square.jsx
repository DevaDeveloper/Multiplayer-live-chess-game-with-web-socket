import React from "react";
import styles from "./Square.module.css";
import wP from "../assets/wP.svg";
import wK from "../assets/wK.svg";
import wB from "../assets/wB.svg";
import wN from "../assets/wN.svg";
import wQ from "../assets/wQ.svg";
import wR from "../assets/wR.svg";
import bB from "../assets/bB.svg";
import bK from "../assets/bK.svg";
import bN from "../assets/bN.svg";
import bQ from "../assets/bQ.svg";
import bR from "../assets/bR.svg";
import bP from "../assets/bP.svg";

const Square = ({ square, socket, room, globalBoardState }) => {
  const sendMove = async (movePlace) => {
    const dataToSend = {
      movePlace,
      room,
    };
    await socket.emit("send_move", dataToSend);
    console.log(`SENT MOVE ${movePlace}`);
  };
  // console.log(globalBoardState);

  const displayPiece = () => {
    switch (globalBoardState[square.squarePlace - 1]) {
      case "B_PIJUN":
        return <img src={wP} alt="White Pawn" />;
      // break;
      case "B_KRALJ":
        return <img src={wK} alt="White King" />;
      // break;
      case "B_LOVAC":
        return <img src={wB} alt="White Bishop" />;
      // break;
      case "B_SKAKAC":
        return <img src={wN} alt="White Knight" />;
      // break;
      case "B_DAMA":
        return <img src={wQ} alt="White Queen" />;
      // break;
      case "B_TOP":
        return <img src={wR} alt="White Rook" />;
      // break;
      case "c_pijun":
        return <img src={bP} alt="Black Pawn" />;
      // break;
      case "c_kralj":
        return <img src={bK} alt="Black King" />;
      // break;
      case "c_lovac":
        return <img src={bB} alt="Black Bishop" />;
      // break;
      case "c_skakac":
        return <img src={bN} alt="Black Knight" />;
      // break;
      case "c_dama":
        return <img src={bQ} alt="Black Queen" />;
      // break;
      case "c_top":
        return <img src={bR} alt="Black Rook" />;
      // break;
      default:
      // console.log("no piece");
    }
  };

  return (
    <>
      <div
        onClick={() => sendMove(square.squarePlace)}
        className={`${
          (square.squarePlace <= 8 && square.squarePlace % 2 !== 0) ||
          (square.squarePlace > 8 &&
            square.squarePlace <= 16 &&
            square.squarePlace % 2 === 0) ||
          (square.squarePlace > 16 &&
            square.squarePlace <= 24 &&
            square.squarePlace % 2 !== 0) ||
          (square.squarePlace > 24 &&
            square.squarePlace <= 32 &&
            square.squarePlace % 2 === 0) ||
          (square.squarePlace > 32 &&
            square.squarePlace <= 40 &&
            square.squarePlace % 2 !== 0) ||
          (square.squarePlace > 40 &&
            square.squarePlace <= 48 &&
            square.squarePlace % 2 === 0) ||
          (square.squarePlace > 48 &&
            square.squarePlace <= 56 &&
            square.squarePlace % 2 !== 0) ||
          (square.squarePlace > 56 && square.squarePlace % 2 === 0)
            ? styles.square_white
            : styles.square_black
        } ${square.selected ? styles.square_selected : null}`}
      >
        {/* {globalBoardState[square.squarePlace - 1]} */}
        {displayPiece()}
        {/* {globalBoardState[square.squarePlace - 1] === "B_PIJUN" && (
          <img src={wP} alt="White Pawn" />
        )}
        {globalBoardState[square.squarePlace - 1] === "B_KRALJ" && (
          <img src={wK} alt="White King" />
        )}
        {globalBoardState[square.squarePlace - 1] === "B_LOVAC" && (
          <img src={wB} alt="White Bishop" />
        )}
        {globalBoardState[square.squarePlace - 1] === "B_SKAKAC" && (
          <img src={wN} alt="White Knight" />
        )}
        {globalBoardState[square.squarePlace - 1] === "B_DAMA" && (
          <img src={wQ} alt="White Queen" />
        )}
        {globalBoardState[square.squarePlace - 1] === "B_TOP" && (
          <img src={wR} alt="White Rook" />
        )}
        {globalBoardState[square.squarePlace - 1] === "c_pijun" && (
          <img src={bP} alt="Black Pawn" />
        )}
        {globalBoardState[square.squarePlace - 1] === "c_skakac" && (
          <img src={bN} alt="Black Knight" />
        )}
        {globalBoardState[square.squarePlace - 1] === "c_lovac" && (
          <img src={bB} alt="Black Bishop" />
        )}
        {globalBoardState[square.squarePlace - 1] === "c_dama" && (
          <img src={bQ} alt="Black Queen" />
        )}
        {globalBoardState[square.squarePlace - 1] === "c_kralj" && (
          <img src={bK} alt="Black King" />
        )}
        {globalBoardState[square.squarePlace - 1] === "c_top" && (
          <img src={bR} alt="Black Rook" />
        )} */}
      </div>
    </>
  );
};

export default Square;
