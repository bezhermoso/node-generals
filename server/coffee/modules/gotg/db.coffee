
exports.attach_views = (db) ->
  db.save '_design/games',
    views:
      all:
        map: ((doc) ->
          (emit null, doc) if doc.type == 'game'
          null).toString()
      open:
        map: ((doc) ->
          (emit null, doc) if doc.type == 'game' && doc.status == 'open'
          null).toString()
      by_player:
        map: ((doc) ->
          if doc.type == 'game'
            emit doc.player1, doc
            emit doc.player2, doc
            null).toString()