(function() {
  'use strict';

  angular.module('facam')
    .controller('HomeController', function($scope, file, svg) {
      $scope.startCamera = function() {
        navigator.FaCamera.getPicture(function(imagePath){
          svg.addImage('file://' + imagePath);
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
        svg.getBlob().then(function(blob) {
          file.postFiles('', [blob]).then(function(response) {
            debugger;
          })
        });
      };
    });
}());
