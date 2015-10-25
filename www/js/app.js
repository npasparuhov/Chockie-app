


angular.module('mychat', ['ionic', 'firebase', 'angularMoment', 'mychat.controllers', 'mychat.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.yourdevices', {
    url: '/yourdevices',
    views: {
      'menuContent': {
        templateUrl: 'templates/yourdevices.html',
        controller: 'YourDevicesCtrl'
      }
    }
  })

  .state('app.newdevice', {
    url: '/newdevice',
    views: {
      'menuContent': {
        templateUrl: 'templates/newdevice.html',
        controller: 'YourDevicesCtrl'
      }
    }
  })

  .state('app.newdevicelist', {
    url: '/newdevicelist',
    views: {
      'menuContent': {
        templateUrl: 'templates/newdevicelist.html',
        controller: 'YourDevicesCtrl'
      }
    }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html'
        }
      }
    })

    .state('app.aboutus', {
      url: '/aboutus',
      views: {
        'menuContent': {
          templateUrl: 'templates/aboutus.html',
          controller: 'AboutUsCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/login');
});
