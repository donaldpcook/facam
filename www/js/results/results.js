(function() {
  'use strict';

  angular.module('facam')
    .controller('ResultsController', function($scope, face, $state) {
      var smiles = face.sortBySmiles();

      var smileList = smiles.sort(function(a, b) {
        return b.smileAverage - a.smileAverage;
      });

      $scope.image = smileList[0].img.src;

      $scope.saveImage = function() {
        navigator.FaCamera.storeImage(function() {
          console.log('success')
          $state.go('home');
        }, function() {
          console.log('failed');
        }, $scope.image);
      };
    });
}());
