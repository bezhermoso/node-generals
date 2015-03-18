
exports.initialize = (db, onError) ->

  db.create (err) ->
    onError err if onError
    null

  db.save '_design/games',
    views:
      # Emit all document of type 'game'
      all:
        map: ((doc) ->
          emit(null, doc) if doc.type == 'game'
          null).toString()
      # Same as 'all', but only if game is waiting for more players.
      open:
        map: ((doc) ->
          emit(null, doc) if doc.type == 'game' && doc.status == 'open'
          null).toString()
      # Same as 'all', but emit documents indexed by the players.
      # Figure out how to deal with duplicates later using `reduce`.
      by_player:
        map: ((doc) ->
          emit(doc.player1, doc) if doc.type == 'game' && doc.player1
          emit(doc.player2, doc) if doc.type == 'game' && doc.player2
          null).toString()
  null