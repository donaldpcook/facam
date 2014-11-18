/* global module: false */

//Controller
angular.module('facam').controller("ImagesCtrl", function($scope, $timeout, $sce) {
	'use strict';

  $scope.images = ["http://placehold.it/150x300/&text=1", "http://placehold.it/3000x150/&text=2", "http://placehold.it/300x300/&text=3"];
  


  $scope.imageLength = 0;
  $scope.svg = {
    imageMetadata : {},
    getIndexByUrl: function (url) {
      for (var i = $scope.images.length - 1; i >= 0; i--) {
        if ($scope.images[i] === url){
          return i;
        }
      }
      return null;
    },
    getImageByIndex: function (index) {
      //Handle undefined, missing, out of range, return an image if lucky, null if not.
      if ($scope.images[index]!=undefined){
        return $scope.images[index];
      }
      if ($scope.images.length > 0) {
        //todo: Remove this block; While helpful in debugging, this is a strange behavior in production.
        console.log('Image',index,' wasn\'t found, using index 0 instead.');
        return $scope.images[0];
      }
      return null;
    },
    getImageMetadataByIndex: function (index) {
      var imageUrl = $scope.svg.getImageByIndex(index);

      if (imageUrl != null){
        
        if ($scope.svg.imageMetadata[imageUrl] !== undefined) {
          //If the metadata already exists, no need to repopulate.
          return $scope.svg.imageMetadata[imageUrl];
        }
        
        var oPreviewImg = new Image();
        oPreviewImg.onload = function(){
          $timeout(function () {
            $scope.svg.imageMetadata[imageUrl].name = oPreviewImg.name;
            $scope.svg.imageMetadata[imageUrl].width = oPreviewImg.width;
            $scope.svg.imageMetadata[imageUrl].height = oPreviewImg.height;
            console.log("'" + oPreviewImg.name + "' is " + oPreviewImg.width + " by " + oPreviewImg.height + " pixels in size.");
          },0);
          return true;
        };
        oPreviewImg.onerror = function(){
          console.log("'" + this.name + "' failed to load.");
          return true;
        }
        $scope.svg.imageMetadata[imageUrl] = {};
        oPreviewImg.src = imageUrl;
        return $scope.svg.imageMetadata[imageUrl];
      }
      console.log('no results were found for getImageMetadataByIndex() for index', index);
      return null;
    },
    height: function () {
      var height = 0;
      angular.forEach($scope.svg.imageMetadata, function (value,key) {
        if(value.height){
          height += value.height;
        }else{
          height += 0;
        }
      });
      return height;
    },
    width: function () {
      var width = 0;
      angular.forEach($scope.svg.imageMetadata, function (value,key) {
        if (value.width) {
          if (width<value.width) {
            width = value.width;
          }
        }
      });
      return width;
    },
    getImageHeight: function (index) {
      return $scope.svg.getImageMetadataByIndex(index).height;
    },
    getImageWidth: function (index) {
      return $scope.svg.getImageMetadataByIndex(index).width;
    },
    getImageX: function (index) {
      var image = $scope.svg.getImageMetadataByIndex(index);
      if(index>0){
        //not the first image
        return 0;
      }else{
        return 0;
      }      
      return 0;
    },
    getImageY: function (index) {
      var image = $scope.svg.getImageMetadataByIndex(index);
      var y = 0;
      if (image!==null){
        if(index>0){
          //not the first image
          for (var i = index-1; i >= 0; i--) {
            var priorImageMetadata = $scope.svg.getImageMetadataByIndex(i);
            if (priorImageMetadata.height != undefined) {
              y += priorImageMetadata.height;
            }
          }
          return y;
        }else{
          return y;
        }
      }
      
      return y;
    }
  }
  $scope.drawImages = function () {
    var canvas =  document.getElementById('fppCanvas');
    var context = canvas.getContext('2d');
    canvas.height = $scope.svg.height();
    canvas.width = $scope.svg.width();
    var images = [];
    for(var i = 0; i < $scope.images.length; i++){
      images[i] = new Image();
      images[i].onload = function(){
        var index = $scope.svg.getIndexByUrl(this.src);
        context.drawImage(this, $scope.svg.getImageX(index), $scope.svg.getImageY(index));
      };
      images[i].src = $scope.images[i];
    }
  };
  $scope.$watch('svg.imageMetadata', function(scope, newValue, oldValue) {
    $scope.drawImages();
  },true);//deepwatch
  $scope.results = function(){
    if ($scope.imageLength > 0){
      return JSON.stringify($scope.imageLength);
    }
    return "No Images (yet)";
  };
  
  $scope.facePPCallback = function (err, results) {
    if (err) {
      console.log('err', err);
      $scope.results = 'Load failed.';
    }else{
      console.log('results', results);
      $timeout(function () {
        $scope.resultsStringified = JSON.stringify(results,2);
        $scope.results = results;
      },0);
    }
  };

  $scope.submitImages = function ($e, image) {
    $e.preventDefault();
    var fileReader = new FileReader();
    debugger;
    // $scope.upload = $upload.upload({
    //   url: 'api/upload',
    //   method: 'POST',
    //   data: angular.toJson($scope.model),
    //   file: file
    // }).progress(function (evt) {
    //     $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
    // }).success(function (data) {
    //     //do something
    // });
  };
  
  $scope.appendImage = function (image) {
    $scope.imagesLength = $scope.images.push(image);
    $scope.appendImageField = '';
  }

  
  //FacePPService.detectFace($scope.imageUrl);

});
