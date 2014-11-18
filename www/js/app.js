// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('facam', ['ionic'])
.config(function ($sceDelegateProvider, $stateProvider, $urlRouterProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://placehold.it/**'
    ]);

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'js/home/home.html',
      controller: 'HomeController'
    })
    .state('results', {
      url: '/results',
      templateUrl: 'js/results/results.html',
      controller: 'ResultsCtrl'
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

.controller('app', function() {

});

