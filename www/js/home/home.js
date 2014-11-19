(function() {
  'use strict';

  angular.module('facam')
    .controller('HomeController', function($scope, file, svg, face, $state) {
      $scope.startCamera = function() {
        navigator.FaCamera.getPicture(function(imagePath){
          svg.addImage('file://' + imagePath);
        });

        navigator.FaCamera.onFinish(function() {
          svg.setImageCoordinates();
          svg.getBlob().then(function(blob) {
            face.detectFaces(blob).then(function(res) {
              face.setFaces(res);
              $state.go('results');
            });
          });
        });
      };


      $scope.finish = function() {
      };
    });
}());
