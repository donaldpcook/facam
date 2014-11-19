(function() {
  'use strict';

  angular.module('facam')
    .controller('HomeController', function($scope, file, svg, face) {
      $scope.startCamera = function() {
        navigator.FaCamera.getPicture(function(imagePath){
          svg.addImage('file://' + imagePath);
        });

        navigator.FaCamera.onFinish(function() {
          svg.getBlob().then(function(blob) {
            face.detectFaces(blob).then(function(res) {
              debugger;
            });
          });
        });
      };
    });
}());
