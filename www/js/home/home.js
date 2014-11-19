(function() {
  'use strict';

  angular.module('facam')
    .controller('HomeController', function($scope, file, svg, face) {
      var i = 5;
      while(i) {
        svg.addImage('/img/test/' + i + '.jpeg');
        i--;
      };
      setTimeout(function() {
        svg.setImageCoordinates();
      }, 1000);
      $scope.startCamera = function() {
        navigator.FaCamera.getPicture(function(imagePath){
          svg.addImage('file://' + imagePath);
        });

        navigator.FaCamera.onFinish(function() {
          svg.getBlob().then(function(blob) {
            face.detectFaces('https://s3.amazonaws.com/dc-magick/187783.jpg').then(function(res) {
              debugger;
              face.getSmiles(res);
            });
            //face.detectFaces(blob).then(function(res) {
              //debugger;
            //});
          });
        });
      };


      $scope.finish = function() {
          svg.getBlob().then(function(blob) {
            face.detectFaces(blob).then(function(res) {
              var test = face.setFaces(res);
            });
          });

      };
    });
}());
