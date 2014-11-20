angular.module('facam', ['ionic'])
.config(function ($sceDelegateProvider, $stateProvider, $urlRouterProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://placehold.it/**'
    ]);

  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'js/landing.html',
      controller: 'AppController'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'js/home/home.html',
      controller: 'HomeController'
    })
    .state('results', {
      url: '/results',
      templateUrl: 'js/results/results.html',
      controller: 'ResultsController'
    });

  $urlRouterProvider.otherwise("/");
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

.controller('AppController', function($state, $ionicPlatform, $ionicLoading, svg, face) {
  $ionicPlatform.ready(function() {
    navigator.FaCamera.getPicture(function(imagePath){
      svg.addImage('file://' + imagePath);
    });

    navigator.FaCamera.onFinish(function() {
      $ionicLoading.show({
        template: '<div class="loading">Loading...</div>'
      });

      svg.setImageCoordinates();
      svg.getBlob().then(function(blob) {
        face.detectFaces(blob).then(function(res) {
          face.setFaces(res);
          $ionicLoading.hide();
          $state.go('results');
        });
      });
    });
  });
});

