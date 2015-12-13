var _ = require('lodash')
var fileExtension = require('file-extension')
var http = require('stream-http')

module.exports = function (SERVER_URL, $q, $http) {
  var data = {
    files: []
  }
  // Used to know if the files list is being loaded
  // so we can reload on the page of a file
  var filesLoading = null

  return {
    getTorrents: getTorrents,
    downloadTorrent: downloadTorrent,
    getFileInfo: getFileInfo, // Just in case for the moment
    data: data
  }

  function downloadTorrent (id) {
    var q = $q.defer()
    http.get(SERVER_URL + 'torrents/' + id, function (res) {
      var data = []
      res.on('data', function (chunk) {
        data.push(chunk) // Append Buffer object
      })

      res.on('end', function () {
        data = Buffer.concat(data)
        q.resolve(data)
      })
    })
    return q.promise
  }

  function getFileInfo (id) {
    var q = $q.defer()
    if (filesLoading) {
      filesLoading.then(function () {
        q.resolve(_getFromList(id))
      }, function () {
        q.reject()
      })
    } else {
      q.resolve(_getFromList(id))
    }
    return q.promise
  }

  function getTorrents () {
    var getPath = 'torrents'
    var deferred = $q.defer()
    filesLoading = $http.get(SERVER_URL + getPath)
    filesLoading.then(function (response) {
      deferred.resolve()
      data.files = response.data
      filesLoading = null
    }, function () {
      deferred.reject()
      filesLoading = null
    })

    return deferred.promise
  }

  function _getFromList (id) {
    return _.findWhere(data.files, {_id: id})
  }
}
