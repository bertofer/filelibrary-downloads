'use strict'
let express = require('express')
let mongodb = require('mongodb')
let debug = require('debug')('filelibrary:downloads')

// db init
let MongoClient = mongodb.MongoClient
let db, files
MongoClient.connect(process.env.DB_PATH, (err, database) => {
  if (err) throw err
  db = database
  files = db.collection('files')
  debug('Connected to db')
})

// Express app
let app = express()

let env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  app.use(require('cors')())
}
app.use(require('body-parser').json())

app.use('/', express.static(__dirname + '/../client'));

app.get('/api/torrents', getTorrents)
app.get('/api/torrents/:id', sendTorrentFile)

function getTorrents (req, res, next) {
  files.find().toArray((err, items) => {
    if (err) next(err)
    res.send(items)
  })
}

function sendTorrentFile (req, res, next) {
  files.findOne({_id: new mongodb.ObjectID(req.params.id)}, (err, file) => {
    if (err) next(err)
    res.send(file.torrent.buffer)
  })
}

app.listen(process.env.APP_PORT)
