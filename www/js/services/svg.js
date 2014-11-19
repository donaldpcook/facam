'use strict';

angular.module('facam')
  .factory('svg', function($q) {
    var images = [];
    var imageCoordinates;
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
             return {image: image, index: i};
           }
           searchY = searchY + meta.height;
         }
       },

       setImageCoordinates: function() {
         if (!images.length) return;

         var imageWidth = 0;
         var imageHeight = 0;

         images.forEach(function(image) {
           imageWidth = image.width;
           imageHeight += image.height;
         });

         var coordinates = [[[[0,0]]]];

         images.forEach(function(image, idx) {
           var width = (image.width / imageWidth) * 100;
           var height = (image.height / imageHeight) * 100;

           if (idx === 0) {
            coordinates[0][idx][1] = [width, height];
           } else {
             coordinates[0][idx] = [];
             coordinates[0][idx][0] = [0, coordinates[0][idx - 1][1][1]];
             coordinates[0][idx][1] = [coordinates[0][idx][0][0] + width, coordinates[0][idx][0][1] + height];
           }
         })

         imageCoordinates = coordinates;
       },

       getImageIndex: function(x, y) {
         var index;

         imageCoordinates[0].forEach(function(el, idx) {
           if ((x > el[0][0] && x < el[1][0]) && (y > el[0][1] && y < el[1][1])) {
             index = idx;
           }
         });

         return index;
         //var test = imageCoordinates.filter(function(coordinates, idx) {
           //var test = coordinates.filter(function(coor, idx) {
             //return ((x > coor[0][0] && x < coor[1][0]) && (y > coor[0][1] && y < coor[1][1]));
           //});
         //});
       },

       getImage: function(x, y) {
         if (!images.length || !x || !y) {
           return;
         }

         var arrayOfX = [];
         var arrayOfY = [];

         images.forEach(function(image) {
           if (!arrayOfX.length) {
             arrayOfX.push(image.width);
           } else {
             var newX;

             arrayOfX.forEach(function(el) {
               newX += el;
             });

             newX += image.height;
             arrayOfX.push(newX);
           }
         });
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

        image.src = imagePath;
      },

      getImageElement: function(idx) {
        return images[idx];
      }
    };
  })

