const uuidv4 = require('uuid/v4');

const DEFAULT_ROWS = 4;
const DEFAULT_COLUMNS = 4;
const ACTIVE_STATE = 'IN_PROGRESS';
const DONE_STATE  = 'DONE';
const PLAYER_1 = 'player1';
const PLAYER_2 = 'player2';

class Game {
    constructor (gameEntity) {
        if (!arguments.length) {
            this.board = this.getEmptyBoard();
            this.status = ACTIVE_STATE;
            this.winner = null;
        }
    }

    toJson () {
        // TODO: everything
    }

    getEmptyBoard(rows = DEFAULT_ROWS, columns = DEFAULT_COLUMNS) {
        return new Array();
    }
}

module.exports = Game;
