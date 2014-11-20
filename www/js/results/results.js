(function() {
  'use strict';

  angular.module('facam')
    .controller('ResultsController', function($scope, $state, $timeout, $ionicPopup, face, svg) {
      var smiles = face.sortBySmiles();

      var smileList = smiles.sort(function(a, b) {
        return b.smileAverage - a.smileAverage;
      });

      smileList = smileList.map(function(smile) {
        smile.img.src = smile.img.src.replace('smfpp42', '');
        return smile;
      });

      if (smileList.length) {
        $scope.images = smileList;
      } else {
        var images = svg.getImages();

        images = images.map(function(image) {
          return {
            img: image
          }
        });

        $scope.failed = true;
        $scope.images = images;
      }

      console.log($scope.failed, $scope.images);

      $scope.saveImage = function(img) {
        navigator.FaCamera.storeImage(null, null, img);
        showPopup();
        //svg.resetImages();
        //$state.go('home');
      };

      $scope.retake = function() {
        svg.resetImages();
        $state.go('landing');
      };

      $scope.saveAll = function() {
        smileList.forEach(function(img) {
          navigator.FaCamera.storeImage(null, null, img.img.src);
        });

        showPopup();
      };

      var showPopup = function() {
        var popup = $ionicPopup.show({
          template: '<span class="results-saved">Saved!</span>',
          scope: $scope
        });

        $timeout(function() {
          popup.close();
        }, 1000);
      }

      $scope.close = function() {
        $scope.modal.hide();
      };
    });
}());
