(function() {
  'use strict';

  angular.module('facam')
    .controller('HomeController', function($scope, file) {
      $scope.startCamera = function() {
        var images = [];

        navigator.FaCamera.getPicture(function(imagePath){
          file.resolveLocalFileSystemUrl(imagePath).then(function(result) {
            file.convertToBlob(result).then(function(blob) {
              images.push(blob);

              //if (images.length === 3) {
                //file.postFiles('https://image-appender.herokuapp.com/', images).then(function(response) {
                //});
              //}
            });
          });
        });
      };
    });
}());
