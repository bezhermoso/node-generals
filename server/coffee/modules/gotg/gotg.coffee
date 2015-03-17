cradle = require 'cradle'
uuid = require 'node-uuid'
Q = require 'q'

Game = (state) -> null

GOTG = () ->
  couch = new(cradle.Connection)()
  db = couch.database('gotg')

  db.create (err) -> console.error err
  require './db'
    .attach_views db

  create = (playerId, name) ->
    deferred = Q.defer()
    db.save uuid.v4(), { player1: playerId, moves: [], type: 'game', status: 'open', name: name },
      (err, res) ->
        if err
          console.error err
          deferred.reject err
        else
          deferred.resolve (JSON.parse res).id
    deferred.promise


  list_open = () ->
    deferred = Q.defer()
    db.view 'games/open', (err, res) ->
      if err
        console.error err
        deferred.reject err
      else
        deferred.resolve res
    deferred.promise

  create: create
  list_open: list_open

exports.GOTG = GOTG