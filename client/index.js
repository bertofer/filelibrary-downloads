var angular = require('angular')
require('ngprogress/build/ngProgress')

var app = angular.module('filelibraryDownloads', [
  'ngProgress',
  'filelibrary.constants'
])

app.controller('listController', require('./controllers/list'))
app.factory('filesFactory', require('./services/files'))
app.factory('downloadsFactory', require('./services/downloads'))
