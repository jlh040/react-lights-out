import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";
const _ = require('lodash');

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      initialBoard.push(Array.from({length: ncols}));
    };

    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        if (Math.random() < 0.5) {
          initialBoard[i][j] = true;
        }
        else initialBoard[i][j] = false;
      }
    }

    return initialBoard;
  }

  /** check the state to see if a player has won */
  function hasWon() {
    return board.every(row => {
      return row.every(val => val === false);
    });
  };

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };
      
      // make copy of current board in the state
      const newBoard = _.cloneDeep(oldBoard);

      // flip the cell and the cells around it
      flipCell(y, x, newBoard);
      flipCell(y + 1, x, newBoard);
      flipCell(y, x + 1, newBoard);
      flipCell(y - 1, x, newBoard);
      flipCell(y, x - 1, newBoard);

      // return the copy
      return newBoard;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (
      <div className="Board-winning-msg">
        <h1>You won!</h1>
      </div>
    )
  }

  // make table board
  return (
    <table>
      {
        board.map((row, idx1) => {
          return <tr>
            {
              row.map((col, idx2) => <Cell isLit={board[idx1][idx2]} 
                                           flipCellsAroundMe={() => flipCellsAround(`${idx1}-${idx2}`)} />)
            }
          </tr>
        })
      }
    </table>
  )
}

export default Board;
