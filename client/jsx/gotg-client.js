
var gameServer = 'http://localhost:3000';

var GOTGClient = function (server) {

    var socket = io(server);

    var socketOn = function (event, fn) {
        socket.on(event, fn);
    };

    var createGame = function (name) {
        socket.emit('new game', JSON.stringify({
            name: name
        }));
    };

    return {
        createGame: createGame,
        _socketOn: socketOn
    }
};

var gameClient = GOTGClient(gameServer);

var GameList = React.createClass({
    server: null,
    getInitialState: function () {
        return { games: [] };
    },
    componentDidMount: function () {
        gameClient._socketOn('open games', function (gameList) {
            this.setState({
                games: gameList.map(function(game) {
                    return game.value;
                })
            });
        }.bind(this));
    },
    render: function () {
        var games = this.state.games.map(function (game) {
           return (
               <GameRow player1={game.player1} player2={game.player2} status={game.status} name={game.name} gameId={game._id}/>
           );
        });
        return (
            <table class="table table-striped">
                <thead>
                    <th>Name</th>
                    <th>Player 1</th>
                    <th>Player 2</th>
                    <th>Status</th>
                    <th>&nbsp;</th>
                </thead>
                {games}
            </table>
        )
    }
});

var GameRow = React.createClass({
    loadGame: function (e) {
        var gameId = jQuery(React.findDOMNode(this.refs['view-join'])).data('game');
        React.render(
            <GameBoard game={gameId}/>,
            document.getElementById('gotg-game-board')
        );
    },
    render: function () {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.player1}</td>
                <td>{this.props.player2}</td>
                <td>{this.props.status}</td>
                <td><a href="#" onClick={this.loadGame} ref="view-join" data-game={this.props.gameId}>View/Join</a></td>
            </tr>
        )
    }
});

var CreateGameForm = React.createClass({
    submit: function (e) {
        e.preventDefault();
        var name = React.findDOMNode(this.refs.name).value.trim();
        if (!name) {
            return;
        }
        gameClient.createGame(name);
    },
    render: function () {
       return (
           <form onSubmit={this.submit}>
               <input type="text" placeholder="Game name..." ref="name" />
               <button>Create Game!</button>
           </form>
       )
    }
});

var GameBoard = React.createClass({
    getInitialState: function () {
        for (var i = 0, board = []; i < 8; ++i && board.push((function() { for (var i = 0, board = []; i < 8; ++i && board.push(null)); return board; })()));
        return {
            board: board
        };
    },
    render: function () {
        var rows = this.state.board.map(function (row) {
           return (
               <GameBoardRow pieces={row} />
           );
        });
        return (
            <div>
                <table>
                    {rows}
                </table>
            </div>
        );
    }
});

var GameBoardRow = React.createClass({
    render: function () {
        var pieces = this.props.pieces.map(function (piece) {
            return (
                <GameBoardSquare piece={piece} />
            );
        });
        return (
            <tr>
                {pieces}
            </tr>
        );
    }
});

var GameBoardSquare = React.createClass({
    render: function () {
        return (
            <td dangerouslySetInnerHTML={this.props.piece}></td>
        );
    }
});

React.render(
    <GameList gameServer={gameServer} />,
    document.getElementById('gotg-gamelist')
);
React.render(
    <CreateGameForm gameServer={gameServer} />,
    document.getElementById('gotg-create-game')
);