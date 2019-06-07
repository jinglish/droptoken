const uuidv4 = require('uuid/v4');

const DEFAULT_ROWS = 4;
const DEFAULT_COLUMNS = 4;
const ACTIVE_STATE = 'IN_PROGRESS';
const DONE_STATE  = 'DONE';

class Game {
    constructor (gameEntity, players, columns, rows) {
        if (!gameEntity) {
            this._id = uuidv4();
            this.board = this.getEmptyBoard(columns, rows);
            this.moves = [];
            this.state = ACTIVE_STATE;
            this.players = players;
            this.player = players[0];
            this.winner = null;
        } else {
            this._id = gameEntity._id;
            this.board = gameEntity.board;
            this.moves = gameEntity.moves;
            this.state = gameEntity.state;
            this.players = gameEntity.players;
            this.winner = gameEntity.winner;
        }
    }

    toJson () {
        return {
            _id: this._id,
            board: this.board,
            moves: this.moves,
            state: this.state,
            players: this.players,
            player: this.player,
            winner: this.winner
        };
    }

    toGameStateJson () {
        if (this.winner) {
            return {
                players: this.players,
                state: this.state,
                winner: this.winner
            };
        }

        return {
            players: this.players,
            state: this.state
        };
    }

    getEmptyBoard (rows = DEFAULT_ROWS, columns = DEFAULT_COLUMNS) {
        let board = new Array(columns);
        for (let i = 0; i < columns; i++) {
            board[i] = new Array(rows);
            for (let j = 0; j < rows; j++) {
                board[i][j] = null;
            }
        }

        return(board);
    }

    playMove (column) {
        if (this.board[column][DEFAULT_ROWS - 1] === null) {
            this.board[column][DEFAULT_ROWS - 1] = this.player;
        } else if (this.board[column][DEFAULT_ROWS - 2] === null) {
            this.board[column][DEFAULT_ROWS - 2] = this.player;
        } else if (this.board[column][DEFAULT_ROWS - 3] === null) {
            this.board[column][DEFAULT_ROWS - 1] = this.player;
        } else {
            this.board[column][DEFAULT_ROWS - 4] = this.player;
        }

        // console.log('players: ' + this.players);
        // console.log(this.players.indexOf(this.player));
        if (this.players.indexOf(this.player) === 0) {
            this.player = this.players[1];
            // console.log('swap 0 to 1');
        } else {
            this.player = this.players[0];
            // console.log('swap 1 to 0');
        }

        // console.log('player is ' + this.player);
    }

    columnIsFull (column) {
        if (!this.board[column].includes(null)) {
            return true;
        }

        return false;
    }

    playerHasWon (player) {
        let COLUMN_START = 0;
        // Check columns
        for (let i = 0; i < this.rows; i++) {
            if ((this.board[i][COLUMN_START] === player)
                    && (this.board[i][COLUMN_START + 1] === player)
                    && (this.board[i][COLUMN_START + 2] === player)
                    && (this.board[i][COLUMN_START + 3] === player)) {
                return true;
            }
        }

        let ROW_START = 0;
        // Check rows
        for (let i = 0; i < this.columns; i++) {
            if ((this.board[ROW_START][i] === player)
                    && (this.board[ROW_START + 1][i] === player)
                    && (this.board[ROW_START + 2][i] === player)
                    && (this.board[ROW_START + 3][i] === player)) {
                return true;
            }
        }

        // Check diagonals
        if ((this.board[ROW_START][COLUMN_START] === player)
                && (this.board[ROW_START + 1][COLUMN_START + 1] === player)
                && (this.board[ROW_START + 2][COLUMN_START + 2] === player)
                && (this.board[ROW_START + 3][COLUMN_START + 3] === player)) {
            return true;
        }
        if ((this.board[3][COLUMN_START] === player)
            && (this.board[2][COLUMN_START + 1] === player)
            && (this.board[1][COLUMN_START + 2] === player)
            && (this.board[0][COLUMN_START + 3] === player)) {
            return true;
        }
    
        return false;
    }

    setWinnerAndDoneState (winner) {
        this.winner = winner;
        this.player = null;
        this.state = DONE_STATE;
    }
}

module.exports = Game;
