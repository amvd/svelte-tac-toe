type Entry = number | null;
type Board = Entry[][];

interface TicTacToe {
  rows: number;
  columns: number;
  board: Board;
  players: string[];
  activePlayer: number;
  turn: number;
}

export const WIN = 'win';
export const TIE = 'tie';

export const DEFAULT_ROWS = 3;
export const DEFAULT_COLS = 3;
export const DEFAULT_PLAYERS = 2;

export const SettingsError = new Error("Settings invalid.");

class TicTacToe {
  constructor(
    rows: number = DEFAULT_ROWS,
    columns: number = DEFAULT_COLS,
    players: number = DEFAULT_PLAYERS
  ) {
    this.__validateSettings(rows, columns, players);
    // Create Board
    this.rows = rows;
    this.columns = columns;
    this.board = Array(rows)
      .fill(null)
      .map(() => Array(columns).fill(null));

    // Create Array of Players (by Default Named By Number)
    this.players = Array(players)
      .fill(null)
      .map((_, i) => `Player ${i + 1}`);
    this.activePlayer = 0;
    this.turn = 0;
  }

  __validateSettings(rows: number, columns: number, players: number) {
    if (rows < 2 || columns < 2 || players < 2) {
      throw SettingsError;
    }
  }

  reset(
    rows: number = this.rows,
    columns: number = this.columns,
    players: number = this.players.length
  ) {
    this.__validateSettings(rows, columns, players);

    this.rows = rows;
    this.columns = columns;

    this.board = Array(this.rows)
      .fill(null)
      .map(() => Array(this.columns).fill(null));

    if (players > this.players.length) {
      this.players = this.players
        .concat(Array(players - this.players.length).fill(null))
        .map((name, i) => (name ? name : `Player ${i + 1}`));
    } else {
      this.players.length = players;
    }

    this.activePlayer = 0;
    this.turn = 0;

    return this;
  }

  setPlayerName(playerIndex: number, newName: string) {
    if (playerIndex < 0 || playerIndex >= this.players.length) {
      throw new Error(`Player ${playerIndex} does not exist.`);
      return;
    }

    this.players[playerIndex] = newName;

    return this;
  }

  __iteratePlayer() {
    console.log('changing player from: ', this.activePlayer)
    this.activePlayer =
      this.activePlayer === this.players.length - 1 ? 0 : this.activePlayer + 1;
    console.log('to: ', this.activePlayer)
  }

  // Returns true if winning move and false otherwise.
  markCell(row: number, col: number) {
    if (row < 0 || col < 0 || row >= this.rows || col >= this.columns) {
      throw new Error(`Cannot play move at row ${row}, column ${col}`);
    }

    if (this.board[row][col] !== null) {
      throw new Error(
        `Someone has already played at row ${row}, column ${col}`
      );
    }

    this.board[row][col] = this.activePlayer;

    if (
      this.__checkRow(row, col) ||
      this.__checkCol(row, col) ||
      this.__checkDiagonals(row, col)
    ) {
      return WIN;
    }

    this.turn++;
    
    if (this.turn >= this.rows * this.columns) {
      return TIE;
    }

    this.__iteratePlayer();
    
    return null;
  }

  __checkCol(row: number, col: number) {
    // Value of the cell we're checking, to match against other
    // cells in the column.
    const originalValue = this.board[row][col];

    let currentRow = 0;

    while (
      this.board[currentRow] &&
      this.board[currentRow][col] !== undefined
    ) {
      if (this.board[currentRow][col] !== originalValue) {
        return false;
      }

      currentRow++;
    }

    return true;
  }

  __checkRow(row: number, col: number) {
    // Value of the cell we're checking, to match against other
    // cells in the row.
    const originalValue = this.board[row][col];

    let currentCol = 0;

    while (this.board[row][currentCol] !== undefined) {
      if (this.board[row][currentCol] !== originalValue) {
        return false;
      }

      currentCol++;
    }

    return true;
  }

  __checkDiagonals(row: number, col: number) {
    // Check if diagonals are even possible.
    if (this.rows !== this.columns) return false;

    // Value of the cell we're checking, to match against other
    // cells in the diagonal.
    const originalValue = this.board[row][col];

    let foundWinner = true;
    let currentRow = 0;
    let currentCol = 0;

    while (
      this.board[currentRow] &&
      this.board[currentRow][currentCol] !== undefined
    ) {
      if (this.board[currentRow][currentCol] !== originalValue) {
        foundWinner = false;
        break;
      }
      currentRow++;
      currentCol++;
    }

    if (foundWinner) {
      return true;
    } else {
      foundWinner = true;
      currentRow = this.rows - 1;
      currentCol = 0;
    }

    while (
      this.board[currentRow] &&
      this.board[currentRow][currentCol] !== undefined
    ) {
      if (this.board[currentRow][currentCol] !== originalValue) {
        foundWinner = false;
        break;
      }
      currentRow--;
      currentCol++;
    }

    return foundWinner;
  }
}

export default TicTacToe;
