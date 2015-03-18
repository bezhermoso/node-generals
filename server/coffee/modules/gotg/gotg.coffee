cradle = require 'cradle'
uuid = require 'node-uuid'
Q = require 'q'

Game = (state) -> null

GOTG = () ->
  couch = new(cradle.Connection)()
  db = couch.database 'gotg'

  require './db'
    .initialize db, console.error

  create = (playerId, name) ->
    deferred = Q.defer()
    db.save uuid.v4(), { player1: playerId, pieces: [], type: 'game', status: 'open', name: name },
      (err, res) ->
        if err
          console.error 'Error when creating game:'
          console.error err
          deferred.reject err
        else
          deferred.resolve (JSON.parse res).id
    deferred.promise


  list_open = () ->
    deferred = Q.defer()
    db.view 'games/open', (err, res) ->
      if err
        console.log 'Error when listing open games:'
        console.error err
        deferred.reject err
      else
        deferred.resolve res
    deferred.promise

  create: create
  list_open: list_open

exports.GOTG = GOTG