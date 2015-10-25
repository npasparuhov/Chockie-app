angular.module('mychat.controllers', ['firebase'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $firebaseAuth, $ionicLoading, $rootScope) {

  var ref = new Firebase("https://simpledb.firebaseio.com/");
  var auth = $firebaseAuth(ref);

  $ionicModal.fromTemplateUrl('templates/signup.html', {
      scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.createUser = function (user) {
        console.log("Create User Function called");
        if (user && user.email && user.password && user.secondpassword == user.password) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });

            auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (userData) {
                alert("User created successfully!");
                ref.child("users").child(userData.uid).set({
                    email: user.email,
                    password: user.password,
                    devices: ""
                });
                $ionicLoading.hide();
                $scope.modal.hide();
            }).catch(function (error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            });
        } else
            alert("Please fill all details");
    }

    $scope.signIn = function (user) {

      if (user && user.email && user.pwdForLogin) {
        $ionicLoading.show({
        template: 'Signing In...'
        });
        auth.$authWithPassword({
          email: user.email,
          password: user.pwdForLogin
        }).then(function (authData) {
            $rootScope.logedUser = authData;
            ref.child("users").child(authData.uid).once('value', function (snapshot) {
                $ionicLoading.hide();
                $state.go('app.yourdevices');
            }).catch(function (error) {
                alert("Authentication failed:" + error.message);
                $ionicLoading.hide();
            });
        } else
            alert("Please enter email and password both");
    }

    $scope.logout = function () {
      console.log("Logging out from the app");
      $ionicLoading.show({
        template: 'Logging Out...'
      });
      auth.$unauth();
      $ionicLoading.hide();
      $state.go('app.login');
    }
})

.controller('YourDevicesCtrl', function($scope, $firebaseAuth, $state, $rootScope, $firebaseArray){

  var ref = new Firebase("https://simpledb.firebaseio.com/");
  $scope.devices = $firebaseArray(ref.child("users").child($rootScope.logedUser.uid).child("devices"));
  $scope.deviceslist = $firebaseArray(ref.child("models"));

  $scope.toDo = function(item){
    ref.child("users").child($rootScope.logedUser.uid).child("devices").child(item.name).set({name: item.name});
  }

  $scope.options = [
    { title: 'Power', id: 1 },
    { title: 'TemperatureUp', id: 2 },
    { title: 'TemperatureDown', id: 3 },
    { title: 'Fan', id: 4 },
    { title: 'Mode', id: 5 },
    { title: 'Timer', id: 6 }
  ];
})

.controller('AboutUsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
});