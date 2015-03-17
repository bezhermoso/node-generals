app = (require 'express')()
http = require 'http'
        .Server app
io = (require 'socket.io')(http)
gotg = (require './modules/gotg/gotg').GOTG()

serverPort = 3000

io.on 'connection', (socket) ->
  console.log 'a user has connected'

  gotg.list_open()
    .then (games) -> socket.emit('open games', games)

  socket.on 'disconnect', () ->
    console.log 'user disconnected.'

  socket.on 'game', (game) ->
    console.log "Game creation request: #{game}"
    gameData = JSON.parse(game)
    gotg.create(1, gameData.name)
      .then (gameId) ->
        console.log "Game created: #{gameId}"
        gotg.list_open()
          .then (games) -> socket.emit('open games', games)


http.listen serverPort, () ->
  console.log "Listening on *:#{serverPort}"
