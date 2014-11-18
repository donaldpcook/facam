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
        angular.forEach(images, function (value,key) {
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
        angular.forEach(images, function (value,key) {
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
        var y = 0;
        images.forEach(function(img, idx) {
          if (idx < index) {
            y += img.height;
          }
        });
        //var image = svg.getImageMetadataByIndex(index);
        //var y = 0;
        //if (image!==null){
          //if(index>0){
            ////not the first image
            //for (var i = index-1; i >= 0; i--) {
              //var priorImageMetadata = svg.getImageMetadataByIndex(i);
              //if (priorImageMetadata.height != undefined) {
                //y += priorImageMetadata.height;
              //}
            //}
            //return y;
          //}else{
            //return y;
          //}
        //}
        
        return y;
      }
    }
    
    
    return {
      imageForCoordinate : function (x, y) {
         if (x<0 || x == undefined) {
           console.log('imageForCoordinate: X was less than zero or undefined');
           if (images[0] !== undefined) {
             return images[0];
           }else{
             return null;
           }
         }
         if (y < 0 || y == undefined) {
           console.log('imageForCoordinate: Y was less than zero or undefined');
           if (images[0] !== undefined) {
             return images[0];
           }else{
             return null;
           }
         }
         if (x > svg.height()) {
           console.log('imageForCoordinate: X was larger than svg.height()');
           if (images[0] !== undefined) {
             return images[0];
           }else{
             return null;
           }
         }
         if (y > svg.width()) {
           console.log('imageForCoordinate: Y was larger than svg.width()');
           if (images[0] !== undefined) {
             return images[0];
           }else{
             return null;
           }
         }


         //after validation our x and y
         var searchX = 0;
         var searchY = 0;

         for (var i = 0; i < images.length; i++) {
           var image = images[i];
           var index = svg.getIndexByUrl(image);
           var meta = svg.getImageMetadataByIndex(index);

           if (searchY < y && (searchY + meta.height) >= y){
             console.log('Found one: [' + index + '] = ' + image);
             return image;
           }
           searchY = searchY + meta.height;
           debugger;
         }
       },
           
      
       
      getBlob: function() {
        var deferred = $q.defer();

        //mock!
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.height = svg.height();
        canvas.width = svg.width();

        images.forEach(function(imageEl, idx) {
          context.drawImage(imageEl, svg.getImageX(idx), svg.getImageY(idx));
        });

        //TODO: make this better, but need to make sure that svg is completely drawn
        setTimeout(function() {
          canvas.toBlob(function(blob) {
            deferred.resolve(blob);
          }, 'image/png');

          //deferred.resolve(canvas.toBlob());
        }, 1000);

        return deferred.promise;
      },

      addImage: function(imagePath) {
        var image = new Image();

        image.onload = function() {
          images.push(this);
        };

        //use this instead of inside of app
        image.src = imagePath;
      }
    };
  })

