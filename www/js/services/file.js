'use strict';

angular.module('facam')
  .factory('file', function($q) {
    return {
      resolveLocalFileSystemUrl: function(path) {
        var deferred = $q.defer();

        window.resolveLocalFileSystemURL('file://' + path, function(file) {
          deferred.resolve(file);
        });

        return deferred.promise;
      },

      convertToBlob: function(file, filetype) {
        var deferred = $q.defer();
        var reader = new FileReader();

        file.file(function(file) {
          reader.onloadend = function() {
            var view = new Uint8Array(reader.result);

            deferred.resolve(new Blob([view], {type: filetype || 'image/png' }));
          };

          reader.readAsArrayBuffer(file);
        });

        return deferred.promise;
      },

      // files must be array of Blobs
      postFiles: function(url, files) {
        var deferred = $q.defer();
        var formData = new FormData();

        if (!url || !files) {
          deferred.reject('URL and Images required');
        } else {
          files.forEach(function(imageBlob) {
            formData.append('img', imageBlob, 'test.png');
          });

          var xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);

          xhr.onload = function () {
            if (xhr.status === 200) {
              // File(s) uploaded.
              deferred.resolve(xhr.response);
            } else {
              deferred.reject();
            }

          };

          xhr.send(formData);
        }

        return deferred.promise;
      }
    }
  });
