var webtorrent = require('webtorrent')
var parseTorrent = require('parse-torrent')

module.exports = function ($q) {
  var client = new webtorrent()
  var torrents = client.torrents

  return {
      startDownload: startDownload,
      saveFile: saveFile,
      torrents: torrents
  }

  function startDownload(torrent) {
      var q = $q.defer();
      client.add(parseTorrent(torrent), function(torrent) {
        q.resolve(torrent);
      });
      return q.promise;
  }

  function saveFile(file) {

    var url = file.getBlobURL(function(err, url){
        if(err) throw err
        var a = document.createElement('a')

        a.target = '_blank'
        a.download = file.name
        a.href = url
        a.textContent = 'Download ' + file.name
        a.click()
    })
  }

}
