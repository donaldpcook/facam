'use strict';

angular.module('facam')
  .factory('face', function($q, file, svg) {
    var FACE_API = 'http://apius.faceplusplus.com/v2';
    var FACE_KEY = 'abf45752049a93d9f00e89123afe1ce3';
    var FACE_SECRET = 'p210gti4Ek5w_CmqJLPFfdBkApfl1sxb';

    var params = {
      api_key: FACE_KEY,
      api_secret: FACE_SECRET
    }

    var faces = [];

    var Face = function(props) {
      this.properties = props;
      this.smilingValue = this.properties.attribute.smiling.value;
      this.photo = svg.getImageIndex(this.properties.position.center.x, this.properties.position.center.y);

      return this;
    };

    Face.prototype.getPhoto = function() {
      return svg.getImageElement(this.photo);
    };

    return {
      detectFaces: function(img) {
        var deferred = $q.defer();

        file.postFiles(FACE_API + '/detection/detect', [img], params).then(function(result) {
          deferred.resolve(JSON.parse(result));
        });

        return deferred.promise;
      },

      setFaces: function(data) {
        data.face.forEach(function(face) {
          faces.push(new Face(face));
        });

        return faces;
      },

      sortByImages: function() {
        var images = [];

        faces.forEach(function(face) {
          if (!images[face.photo]) {
            images[face.photo] = [];
          }

          images[face.photo].push(face);
        });

        return images;
      },

      sortBySmiles: function() {
        var originalImages = svg.getImages();
        var images = this.sortByImages();
        var smileAverages = [];

        images.forEach(function(image, idx) {
          var smileTotal = 0;

          image.forEach(function(face) {
            smileTotal += face.smilingValue;
          });

          smileAverages[idx] = {
            smileAverage: smileTotal / image.length,
            img: originalImages[idx]
          }
        });

        return smileAverages;
      }
    }
  });
