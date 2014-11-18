(function() {
  'use strict';

  angular.module('facam')
    .controller('HomeController', function($scope, file, svg) {
      $scope.startCamera = function() {
          svg.addImage('http://placehold.it/150x300/&text=1');
        //navigator.FaCamera.getPicture(function(imagePath){
          //svg.addImage('file://' + imagePath);
          //file.resolveLocalFileSystemUrl(imagePath).then(function(result) {
            //file.convertToBlob(result).then(function(blob) {
              //images.push(blob);

              ////if (images.length === 3) {
                ////file.postFiles('https://image-appender.herokuapp.com/', images).then(function(response) {
                ////});
              ////}
            //});
          //});
        //});
      };

      $scope.finish = function() {
        debugger;

        svg.getBlob();

        setTimeout(function() {
          //document.getElementById('test').appendChild(canvas);
        }, 1000);
      };
    });
}());
