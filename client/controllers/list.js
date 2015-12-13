var fileExtension = require('file-extension')
var debug = require('debug')('listFiles')
var prettysize = require('prettysize')

module.exports = function (filesFactory, downloadsFactory, $scope, $timeout, ngProgressFactory) {
  var self = this;
  this.data = filesFactory.data
  $scope.ngprogress = ngProgressFactory.createInstance()
  $scope.ngprogress.setParent(document.getElementById('list-container'))
  $scope.ngprogress.setAbsolute()
  $scope.ngprogress.setColor('#bd2308')
  $timeout(loadFiles())

  function loadFiles () {
    $scope.ngprogress.start()
    filesFactory.getTorrents().then(function () {
      $scope.ngprogress.complete()
      debug('loaded files')
    }, function () {
      $scope.ngprogress.complete()
      debug('error getting files')
    })
  }

  this.getDataType = function (file) {
    return fileExtension(file.name)
  }

  this.getPrettySize = function (size) {
    return prettysize(size)
  }

  this.download = function (file) {
    filesFactory.downloadTorrent(file._id).then(function (data) {
        downloadsFactory.startDownload(data).then(function(torrent) {
            file.downloading = torrent

            // We should apply after events or angularjs
            // doesn't notice the changes
            torrent.on('done', function () {
                $scope.$apply()
            })
            torrent.on('download', function () {
                $scope.$apply()
            })
        })
    })
  }

  this.saveFile = function (file) {
      downloadsFactory.saveFile(file.downloading.files[0])
  }
}
