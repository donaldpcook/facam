'use strict';

angular.module('facam')
  .factory('svg', function($q) {
    var images = [];
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    
    var svg = {
      imageMetadata : {},

      getIndexByUrl: function (url) {
        for (var i = images.length - 1; i >= 0; i--) {
          if (images[i] === url){
            return i;
          }
        }
        return null;
      },

      getImageByIndex: function (index) {
        //Handle undefined, missing, out of range, return an image if lucky, null if not.
        if (images[index]!=undefined){
          return images[index];
        }
        if (images.length > 0) {
          //todo: Remove this block; While helpful in debugging, this is a strange behavior in production.
          console.log('Image',index,' wasn\'t found, using index 0 instead.');
          return images[0];
        }
        return null;
      },

      getImageMetadataByIndex: function (index) {
        var imageUrl = svg.getImageByIndex(index);

        if (imageUrl != null){
          
          if (svg.imageMetadata[imageUrl] !== undefined) {
            //If the metadata already exists, no need to repopulate.
            return svg.imageMetadata[imageUrl];
          }
          
          var oPreviewImg = new Image();
          oPreviewImg.onload = function(){
            $timeout(function () {
              svg.imageMetadata[imageUrl].name = oPreviewImg.name;
              svg.imageMetadata[imageUrl].width = oPreviewImg.width;
              svg.imageMetadata[imageUrl].height = oPreviewImg.height;
              console.log("'" + oPreviewImg.name + "' is " + oPreviewImg.width + " by " + oPreviewImg.height + " pixels in size.");
            },0);
            return true;
          };
          oPreviewImg.onerror = function(){
            console.log("'" + this.name + "' failed to load.");
            return true;
          }
          svg.imageMetadata[imageUrl] = {};
          oPreviewImg.src = imageUrl;
          return svg.imageMetadata[imageUrl];
        }
        console.log('no results were found for getImageMetadataByIndex() for index', index);
        return null;
      },

      height: function () {
        var height = 0;
        angular.forEach(svg.imageMetadata, function (value,key) {
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
        angular.forEach(svg.imageMetadata, function (value,key) {
          if (value.width) {
            if (width<value.width) {
              width = value.width;
            }
          }
        });
        return width;
      },

      getImageHeight: function (index) {
        return svg.getImageMetadataByIndex(index).height;
      },

      getImageWidth: function (index) {
        return svg.getImageMetadataByIndex(index).width;
      },

      getImageX: function (index) {
        var image = svg.getImageMetadataByIndex(index);
        if(index>0){
          //not the first image
          return 0;
        }else{
          return 0;
        }      
        return 0;
      },

      getImageY: function (index) {
        var image = svg.getImageMetadataByIndex(index);
        var y = 0;
        if (image!==null){
          if(index>0){
            //not the first image
            for (var i = index-1; i >= 0; i--) {
              var priorImageMetadata = svg.getImageMetadataByIndex(i);
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

    return {
      getBlob: function(originalImages) {
        images = originalImages;

        var deferred = $q.defer();

        //mock!
        images = ["http://placehold.it/150x300/&text=1", "http://placehold.it/3000x150/&text=2", "http://placehold.it/300x300/&text=3"];

        
        canvas.height = svg.height();
        canvas.width = svg.width();

        images.forEach(function(imageUrl, idx) {
          var image = new Image();
          image.onload = function(){
            context.drawImage(this, idx * 50, 0);
          };

          //use this instead of inside of app
          //image.src = 'file://' + imageUrl;
          image.src = imageUrl;
        });

        

        //TODO: make this better, but need to make sure that svg is completely drawn
        setTimeout(function() {
          debugger;
          //deferred.resolve(canvas.toBlob());
        }, 1000);

        return deferred.promise;
      }
    };
  })
