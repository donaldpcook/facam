// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('facam', ['ionic'])
.config(function ($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://placehold.it/**'
    ]);
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})

.controller('app', function(file) {
  document.getElementById("openCustomCameraBtn").addEventListener("click", function(){
    alert("Event Listener: Click: #openCustomCameraBtn");
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
  });
});

