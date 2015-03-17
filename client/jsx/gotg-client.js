
var gameServer = 'http://localhost:3000';

var serverf = function (url) {
    var socket = null;
    return function () {
        if (socket === null) {
          socket = io(url);
        }
        return socket;
    };
}

var server = serverf(gameServer);

var GameList = React.createClass({
    server: null,
    getInitialState: function () {
        return { games: [] };
    },
    componentDidMount: function () {
        var socket = server();
        socket.on('open games', function (gameList) {
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
    render: function () {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.player1}</td>
                <td>{this.props.player2}</td>
                <td>{this.props.status}</td>
                <td><a href={"/game/" + this.props.gameId}>View/Join</a></td>
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
        server().emit('game', JSON.stringify({
            name: name
        }));
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

React.render(
    <GameList gameServer={gameServer} />,
    document.getElementById('gotg-gamelist')
);
React.render(
    <CreateGameForm gameServer={gameServer} />,
    document.getElementById('gotg-create-game')
);