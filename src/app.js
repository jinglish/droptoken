let Express = require('express');
let Nedb = require('nedb');
const Game = require ('./game');

let app = Express();
let database = new Nedb();
const APPLICATION_PORT = 3030;

// Returns all active games
app.get('/drop_token', (request, response) => {
    // Get and return all games
});

// Creates a new game
app.post('/drop_token', (request, response) => {
    let game = new Game();
    database.insert(game.toJson(), (error, persistedGame) => {
        if (error) {
            return response.status(500).send(error.message);
        }
    });
});

// Returns the state of a specific game
app.get('/drop_token/:gameId', (request, response) => {
    // TODO: validate input

    database.fineOne({_id: request.params.gameId}, (error, game) => {
        if (error) {
            return response.status(500).send(error.message);
        }

        if (!game) {
            return response.status(404).send('Game not found');
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
app.delete('/drop_token/:gameId/:playerId');

const server = app.listen(APPLICATION_PORT, () => {
    console.log('Drop token game running on port ' + server.address().port + '!');
});

module.exports = server;
