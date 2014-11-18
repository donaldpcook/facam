'use strict';

angular.module('facam')
  .factory('svg', function($q) {
    var images = [];
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
      getBlob: function() {
        var deferred = $q.defer();

        debugger;
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


/*
 * JavaScript Canvas to Blob 2.0.5
 * https://github.com/blueimp/JavaScript-Canvas-to-Blob
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on stackoverflow user Stoive's code snippet:
 * http://stackoverflow.com/q/4998908
 */

/*jslint nomen: true, regexp: true */
/*global window, atob, Blob, ArrayBuffer, Uint8Array, define */

(function (window) {
    'use strict';
    var CanvasPrototype = window.HTMLCanvasElement &&
            window.HTMLCanvasElement.prototype,
        hasBlobConstructor = window.Blob && (function () {
            try {
                return Boolean(new Blob());
            } catch (e) {
                return false;
            }
        }()),
        hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array &&
            (function () {
                try {
                    return new Blob([new Uint8Array(100)]).size === 100;
                } catch (e) {
                    return false;
                }
            }()),
        BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
            window.MozBlobBuilder || window.MSBlobBuilder,
        dataURLtoBlob = (hasBlobConstructor || BlobBuilder) && window.atob &&
            window.ArrayBuffer && window.Uint8Array && function (dataURI) {
                var byteString,
                    arrayBuffer,
                    intArray,
                    i,
                    mimeString,
                    bb;
                if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                    // Convert base64 to raw binary data held in a string:
                    byteString = atob(dataURI.split(',')[1]);
                } else {
                    // Convert base64/URLEncoded data component to raw binary data:
                    byteString = decodeURIComponent(dataURI.split(',')[1]);
                }
                // Write the bytes of the string to an ArrayBuffer:
                arrayBuffer = new ArrayBuffer(byteString.length);
                intArray = new Uint8Array(arrayBuffer);
                for (i = 0; i < byteString.length; i += 1) {
                    intArray[i] = byteString.charCodeAt(i);
                }
                // Separate out the mime component:
                mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                // Write the ArrayBuffer (or ArrayBufferView) to a blob:
                if (hasBlobConstructor) {
                    return new Blob(
                        [hasArrayBufferViewSupport ? intArray : arrayBuffer],
                        {type: mimeString}
                    );
                }
                bb = new BlobBuilder();
                bb.append(arrayBuffer);
                return bb.getBlob(mimeString);
            };
    if (window.HTMLCanvasElement && !CanvasPrototype.toBlob) {
        if (CanvasPrototype.mozGetAsFile) {
            CanvasPrototype.toBlob = function (callback, type, quality) {
                if (quality && CanvasPrototype.toDataURL && dataURLtoBlob) {
                    callback(dataURLtoBlob(this.toDataURL(type, quality)));
                } else {
                    callback(this.mozGetAsFile('blob', type));
                }
            };
        } else if (CanvasPrototype.toDataURL && dataURLtoBlob) {
            CanvasPrototype.toBlob = function (callback, type, quality) {
                callback(dataURLtoBlob(this.toDataURL(type, quality)));
            };
        }
    }
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return dataURLtoBlob;
        });
    } else {
        window.dataURLtoBlob = dataURLtoBlob;
    }
}(this));
