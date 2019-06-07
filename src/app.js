let Express = require('express');
let bodyParser = require('body-parser');
let Nedb = require('nedb');
const Game = require ('./game');

let app = Express();
app.use(bodyParser.json());
let database = new Nedb();
const APPLICATION_PORT = 3030;

const GAME_NOT_FOUND_MESSAGE = 'Game not found';
const PLAYER_NOT_IN_GAME_MESSAGE = 'That player is not a participant in this game'

// Returns all active games
app.get('/drop_token', (request, response) => {
    database.find({state: 'IN_PROGRESS'}, (error, activeGames) => {
        if (error) {
            return response.status(500).send(error.message);
        }
        const activeGameIds = activeGames.map((game) => game._id);
        return response.status(200).send({
            games: activeGameIds
        });
    });
});

// Creates a new game
app.post('/drop_token', (request, response) => {
    let players = request.body.players;
    let columns = request.body.columns;
    let rows = request.body.rows;

    if (!columns || !rows || !Array.isArray(players)) {
        return response.status(400).send('Request body was not properly formatted');
    }

    let game = new Game(null, players, columns, rows);
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
    database.findOne({_id: request.params.gameId}, (error, persistedGame) => {
        if (error) {
            return response.status(500).send(error.message);
        }

        if (!persistedGame) {
            return response.status(404).send(GAME_NOT_FOUND_MESSAGE);
        }

        let game = new Game(persistedGame);
        return response.send(game.toGameStateJson());
    });
});

// Returns a list of a specific game's moves
app.get('/drop_token/:gameId/moves', (request, response) => {
    database.findOne({_id: request.params.gameId}, (error, persistedGame) => {
        // Don't think 410 is relevent unless I add query parameters?
        
        if (error) {
            return response.status(500).send(error.message);
        }

        if (!persistedGame) {
            return response.status(404).send(GAME_NOT_FOUND_MESSAGE);
        }

        // TODO: figure out why this isn't
        if (persistedGame.moves === []) {
            return response.status(404).send('No moves have been played in this game');
        }

        return response.send({
            moves: persistedGame.moves
        });
    });
});

// Adds a move for a given player
app.post('/drop_token/:gameId/:playerId', (request, response) => {
    database.findOne({_id: request.params.gameId}, (error, persistedGame) => {
        if (error) {
            return response.status(500).send(error.message);
        }

        if (!persistedGame) {
            return response.status(404).send(GAME_NOT_FOUND_MESSAGE);
        }

        let game = new Game(persistedGame);
        
        // Checks if player is in the game's players array
        if (game.players.indexOf(request.params.playerId) === -1) {
            return response.status(404).send('The player ' + request.params.playerId + ' is not a participant in this game');
        }

        if (request.params.playerId !== persistedGame.player) {
            return response.status(409).send('It is not player ' + request.params.playerId + '\'s turn');
        }

        if (!Number.isInteger(request.body.column)) {
            return response.status(400).send('Malformed input: column is not an integer');
        }
        
        if ((request.body.column < 0 ) || (request.body.column > 3)) {
            return reponse.status(400).send('Malformed input: column is out of bounds');
        }

        if (game.columnIsFull(request.body.column)) {
            return response.status(400).send('Illegal move; column is full');
        }

        let move = {
            type: 'MOVE',
            player: request.params.playerId,
            column: request.body.column
        };
        game.moves.push(move);
        game.playMove(request.body.column);
        database.update({_id: game._id}, game.toJson(), {}, (err) => {
            if (err) {
                return response.status(500).send(err.message);
            }

            return response.status(200).send({
                move: game._id + '/moves/' + (game.moves.length - 1)
            });
        });
    });
});

// Returns a specific move
app.get('/drop_token/:gameId/moves/:moveNumber', (request, response) => {
    database.findOne({_id: request.params.gameId}, (error, persistedGame) => {
        if (error) {
            return response.status(500).send(error.message);
        }

        if (!persistedGame) {
            return response.status(404).send(GAME_NOT_FOUND_MESSAGE);
        }

        if (persistedGame.moves[request.params.moveNumber] === undefined) {
            return response.status(404).send('The move does not exist');
        }

        // TODO: add 400/malformed request?

        return response.status(200).send(persistedGame.moves[request.params.moveNumber]);
    });
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

        if (!persistedGame.players.includes(request.params.playerId)) {
            return response.status(404).send(PLAYER_NOT_IN_GAME_MESSAGE);
        }
        
        if (persistedGame.player !== request.params.playerId) {
            return response.status(404).send('It is not player ' + request.params.playerId + '\'s turn');
        }

        if (persistedGame.state === 'DONE') {
            return response.status(410).send('The game has already been completed');
        }

        let game = new Game(persistedGame);
        let newMove = {type: 'QUIT', player: game.player};
        game.moves.push(newMove);
        let winningPlayer = 0;
        if (game.players.indexOf(game.player) === 0) {
            winningPlayer = 1;
        }
        game.setWinnerAndDoneState(winningPlayer);
        game.state = 'DONE';
        database.update({_id: game._id}, game.toJson(), {}, (err) => {
            if (err) {
                return response.status(500).send(err.message);
            }

            return response.status(202).send();
        });
    });
});

const server = app.listen(APPLICATION_PORT, () => {
    console.log('Drop token game running on port ' + server.address().port + '!');
});

module.exports = server;
