let Express = require('express');
let Nedb = require('nedb');
const Game = require ('./game');

let app = Express();
let database = new Nedb();
const APPLICATION_PORT = 3030;

const GAME_NOT_FOUND_MESSAGE = 'Game not found';
const PLAYER_NOT_IN_GAME_MESSAGE = 'That player is not a participant in this game'



// Returns all active games
app.get('/drop_token', (request, response) => {
    // Get and return all games
});

// Creates a new game
app.post('/drop_token', (request, response) => {
    let players = request.body.players;
    let columns = request.body.columns;
    let rows = request.body.rows;

    if (!columns || !rows || !Array.isArray(players)) {
        return response.status(400).send('Request body was not properly formatted');
    }

    let game = new Game(players, columns, rows);
    database.insert(game.toJson(), (error, persistedGame) => {
        if (error) {
            return response.status(500).send(error.message);
        }

        return response.status(200).send({
            gameId: persistedGame._id
        });
    });
});

// Returns the state of a specific game
app.get('/drop_token/:gameId', (request, response) => {
    // TODO: validate input

    database.findOne({_id: request.params.gameId}, (error, game) => {
        if (error) {
            return response.status(500).send(error.message);
        }

        if (!game) {
            return response.status(404).send(GAME_NOT_FOUND_MESSAGE);
        }

        return response.send(game);
    });
});

// Returns a (sub?) list of a specific game's moves
app.get('/drop_token/:gameId/moves', (request, response) => {

});

// Adds a move for a given player
app.post('/drop_token/:gameId/:playerId', (request, response) => {

});

// Returns a specific move
app.get('/drop_token/:gameId/moves/:moveNumber', (request, response) => {

});

// Quits the game for a given player
app.delete('/drop_token/:gameId/:playerId', (request, response) => {
    database.findOne({_id: request.params.gameId}, (error, persistedGame) => {
        if (error) {
            return response.status(500).send(error.message);
        }

        if (!persistedGame) {
            return response.status(404).send(GAME_NOT_FOUND_MESSAGE);
        }

        if (persistedGame.player !== request.params.playerId) {
            return response.status(404).send(PLAYER_NOT_IN_GAME_MESSAGE);
        }

        if (persistedGame.state === 'DONE') {
            return response.status(410).send('The game has already been completed');
        }

        let game = new Game(persistedGame);
        let newMove = {type: 'QUIT', player: game.player};
        game.moves.push();
        game.state = 'DONE';
    });
});

const server = app.listen(APPLICATION_PORT, () => {
    console.log('Drop token game running on port ' + server.address().port + '!');
});

module.exports = server;
