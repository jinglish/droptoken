const uuidv4 = require('uuid/v4');

const DEFAULT_ROWS = 4;
const DEFAULT_COLUMNS = 4;
const ACTIVE_STATE = 'IN_PROGRESS';
const DONE_STATE  = 'DONE';

class Game {
    constructor (gameEntity) {
        if (!arguments.length) {
            this.board = this.getEmptyBoard();
            this.moves = [];
            this.state = ACTIVE_STATE;
            // TODO: fix this
            this.players = [PLAYER_1, PLAYER_2];
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
        return new Array();
    }

    playMove (column) {
        
    }

    playerHasWon (player) {
        let COLUMN_START = 0;
        // Check columns
        for (let i = 0; i < this.rows; i++) {
            if ((this.board[i][COLUMN_START] === player)
                    && (this.board[i][COLUMN_START + 1] === player)
                    && (this.board[i][COLUMN_START + 2] === player)
                    && (this.board[i][COLUMN_START + 3] === player)) {
                this.setWinnerAndDoneState();
                return true;
            }
        }

        let ROW_START = 0;
        // Check rows
        for (let i = 0; i < this.columns; i++) {
            if ((this.board[ROW_START][i] === player)
                    && (this.board[ROW_START + 1][i] === player)
                    && (this.board[ROW_START + 2][i] === player)
                    && (this.board[ROW_START + 3][i] === player))) {
                this.setWinnerAndDoneState();
                return true;
            }
        }

        // Check diagonals
        if ((this.board[ROW_START][COLUMN_START] === player)
                && (this.board[ROW_START + 1][COLUMN_START + 1] === player)
                && (this.board[ROW_START + 2][COLUMN_START + 2] === player)
                && (this.board[ROW_START + 3][COLUMN_START + 3] === player)) {
            this.setWinnerAndDoneState();
            return true;
        }
        /* if ((this.board[ROW_START][COLUMN_START] === player)
            && (this.board[ROW_START + 1][COLUMN_START + 1] === player)
            && (this.board[ROW_START + 2][COLUMN_START + 2] === player)
            && (this.board[ROW_START + 3][COLUMN_START + 3] === player)) {
            return true;
        }*/
    
        return false;
    }

    setWinnerAndDoneState () {
        this.winner = this.player;
        this.player = null;
        this.state = DONE_STATE;
    }
}

module.exports = Game;
