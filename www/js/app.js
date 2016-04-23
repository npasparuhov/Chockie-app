
angular.module('Chockie', ['ionic', 'firebase', 'ngMap', 'Chockie.controllers', 'Chockie.services', 'ionic-material', 'ionMdInput'])

.run(function($ionicPlatform, $rootScope, User) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //Track geolocation until app is unistalled
    /**
    * This callback will be executed every time a geolocation is recorded in the background.
    */
    var value = 0;
    var callbackFn = function(location) {
          User.position.latitude = location.latitude;
          User.position.longitude = location.longitude;
          value++;
          var ref = new Firebase("https://simpledb.firebaseio.com/");
          ref.child("users").child("4c38b32c-1726-4bd4-b1af-d1d395805d74").child("locations").child(new Date().toUTCString()).set({latitude: location.latitude, longitude: location.longitude});
          backgroundGeoLocation.finish();  
    };
 
    var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
    };
 
    // BackgroundGeoLocation is highly configurable. See platform specific configuration options 
    backgroundGeoLocation.configure(callbackFn, failureFn, {
        desiredAccuracy: 10,
        stationaryRadius: 10,
        distanceFilter: 15,
        //debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
        notificationTitle: 'Number of tracks',
        notificationText: 'Currently count: ' + value,
        locationService: backgroundGeoLocation.service.ANDROID_DISTANCE_FILTER
    });
 
    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app. 
    backgroundGeoLocation.start();
 
  });

  //AutoLogin
  var user = {email: localStorage.getItem("email"), password: localStorage.getItem("pass")};
  if(localStorage.getItem("email") && localStorage.getItem("pass")) {
    User.signIn(user);    
  }

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


  $ionicConfigProvider.views.maxCache(0);

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

  .state('app.yourrooms', {
    url: '/yourrooms',
    views: {
      'menuContent': {
        templateUrl: 'templates/yourrooms.html',
        controller: 'YourDevicesCtrl'
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

  .state('app.ACPanel', {
    url: '/ACPanel',
    views: {
      'menuContent': {
        templateUrl: 'templates/ACPanel.html',
        controller: 'YourDevicesCtrl'
      }
    }
  })

  .state('app.SettopBoxPanel', {
    url: '/SettopBoxPanel',
    views: {
      'menuContent': {
        templateUrl: 'templates/SettopBoxPanel.html',
        controller: 'YourDevicesCtrl'
      }
    }
  })

  .state('app.TVPanel', {
    url: '/TVPanel',
    views: {
      'menuContent': {
        templateUrl: 'templates/TVPanel.html',
        controller: 'YourDevicesCtrl'
      }
    }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
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