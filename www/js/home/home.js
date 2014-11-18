(function() {
  'use strict';

  angular.module('facam')
    .controller('HomeController', function($scope, file, svg) {
      var images = [];

      $scope.startCamera = function() {
        navigator.FaCamera.getPicture(function(imagePath){
          images.push(imagePath);
          //file.resolveLocalFileSystemUrl(imagePath).then(function(result) {
            //file.convertToBlob(result).then(function(blob) {
              //images.push(blob);

              ////if (images.length === 3) {
                ////file.postFiles('https://image-appender.herokuapp.com/', images).then(function(response) {
                ////});
              ////}
            //});
          //});
        });
      };

      $scope.finish = function() {
        debugger;

        svg.getBlob();

        setTimeout(function() {
          document.getElementById('test').appendChild(canvas);
        }, 1000);
      };
    });
}());
