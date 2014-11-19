'use strict';

angular.module('facam')
  .factory('face', function($q, file) {
    var FACE_API = 'http://apius.faceplusplus.com/v2';
    var FACE_KEY = 'abf45752049a93d9f00e89123afe1ce3';
    var FACE_SECRET = 'p210gti4Ek5w_CmqJLPFfdBkApfl1sxb';

    var params = {
      api_key: FACE_KEY,
      api_secret: FACE_SECRET
    }

    return {
      detectFaces: function(img) {
        var deferred = $q.defer();

        file.postFiles(FACE_API + '/detection/detect', [img], params).then(function(result) {
          deferred.resolve(JSON.parse(result));
        });

        return deferred.promise;
      }
    }
  });
