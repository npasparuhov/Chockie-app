angular.module('Chockie.controllers', ['firebase'])

.controller('AppCtrl', function($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion, User) {

  $ionicSideMenuDelegate.canDragContent(false);

  $ionicModal.fromTemplateUrl('templates/signup.html', {
      scope: $scope
  }).then(function (modal) {
      $scope.modal = modal;
  });


    $scope.createUser = function (user) {
      User.createUser(user);
      $scope.modal.hide();
    }

    $scope.signIn = function (user) {
      User.signIn(user);
    }

    $scope.logout = function(){
      User.logout();
    }

    // Set Ink
    ionicMaterialInk.displayEffect();
    $timeout(function(){
    // Set Motion
    ionicMaterialMotion.ripple();
    }, 300);
})


.controller('YourDevicesCtrl', function($scope, $ionicModal, $state, $rootScope, $firebaseObject, $firebaseArray, $timeout, ionicMaterialInk, ionicMaterialMotion, User, Device, Devices){

  //Variable initialize
  var ref = new Firebase("https://simpledb.firebaseio.com/");
  $scope.listOfTypeOfDevices = $firebaseArray(ref.child("models"));
  $scope.rooms = $firebaseArray(ref.child("users").child(User.logedUser.uid).child("rooms"));
  $scope.showNewRoom = true;
  $scope.yourDevices = Devices;
  $rootScope.selected;


  var animations = function() {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
  }

  $scope.modes = [{title: "Automatic"},{title: "Hot"},{title: "Cool"},{title: "Dry"},{title: "Fan"}];
  $scope.fans =  [{title: "A", id: "A"},
                    {title: "H", id: "H"},
                    {title: "M", id: "M"},
                    {title: "L", id: "L"}];

  $scope.commands = [
        { title: 'Power', id: "KEY_POWER" }, 
        { title: 'ChanelUp', id: "KEY_CHANNELUP" },
        { title: 'ChanelDown', id: "KEY_CHANNELDOWN" },
        { title: 'VolumeUp', id: "KEY_VOLUMEUP" },
        { title: 'VolumeDown', id: "KEY_VOLUMEDOWN" },
        { title: '0', id: "KEY_0" },
        { title: '1', id: "KEY_1" },
        { title: '2', id: "KEY_2" },
        { title: '3', id: "KEY_3" },
        { title: '4', id: "KEY_4" },
        { title: '5', id: "KEY_5" },
        { title: '6', id: "KEY_6" },
        { title: '7', id: "KEY_7" },
        { title: '8', id: "KEY_8" },
        { title: '9', id: "KEY_9" },
        { title: 'TV/AV', id: "KEY_TV"}
        ];


  $ionicModal.fromTemplateUrl('templates/AddDevice.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });


  //Add new device or room
  $scope.Submit = function(){
    var device = {typeOfDevice: "", brand: "", codes: "", room: ""};

    //Check if all of the fields are filled correctly
    if($rootScope.typeOfDevice == null || $rootScope.brand == undefined || $rootScope.room == "")alert("Please fill all of the fields!");

    else{
      //Initialize device taken from the input of the modal
      device.typeOfDevice = $rootScope.typeOfDevice.$id;
      device.brand = $rootScope.brand.$id;
      device.room = $rootScope.room;

      for(index in $scope.rooms){
      if($scope.rooms[index].$id == $rootScope.room  && $scope.showNewRoom != false){
        alert("You already have this room!");
        $rootScope.room = "";
        $scope.listOfTypeOfDevices = $firebaseArray(ref.child("models"));
        $scope.modal.hide();
        $rootScope.typeOfDevice = false;
      }
    }

    
    if($rootScope.room){
      Devices.createRoom(device);

      $scope.listOfTypeOfDevices = $firebaseArray(ref.child("models"));
      $rootScope.typeOfDevice = false;
      $scope.rooms = $firebaseArray(ref.child("users").child(User.logedUser.uid).child("rooms"));


      $scope.rooms.$loaded().then(function() {
      $timeout(animations, 300);
        delete $rootScope.room;
      });

      $scope.modal.hide();
    }


    if($scope.showNewRoom == false){
      device.room = $rootScope.selectedRoom;
      Devices.createDevice(device);

      $scope.listOfTypeOfDevices = $firebaseArray(ref.child("models"));
      $rootScope.typeOfDevice = false;
      $timeout(animations, 300);
      $scope.modal.hide();
    }

    }
    
  }

  $scope.PowerOnOff = function(){
    if(Devices[$rootScope.selected].power == false){
      Devices[$rootScope.selected].power = true;
      Devices[$rootScope.selected].PowerOnOff();
    }
    
    else {
      Devices[$rootScope.selected].power = false;
      Devices[$rootScope.selected].PowerOnOff();
    }

    console.log(Devices[$rootScope.selected]);
  }

  $scope.sendCommand = function(command){

    if(command == 404){
      Devices[$rootScope.selected].temp = $rootScope.temp;
      Devices[$rootScope.selected].fanOption = $rootScope.fanOption;
      Devices[$rootScope.selected].command = "Temp" + Devices[$rootScope.selected].temp + Devices[$rootScope.selected].fanOption;
      Devices[$rootScope.selected].sendCommand();
      console.log(Devices[$rootScope.selected]);
    }

    else {
      Devices[$rootScope.selected].command = command;
      Devices[$rootScope.selected].sendCommand(command);
      console.log(Devices[$rootScope.selected]);
    }
    
  }

  $scope.refreshBrands = function(){
    $scope.brands = $firebaseArray(ref.child("models").child($rootScope.typeOfDevice.$id));
  }


  //Selected device is device, go to control panel and take the correct device drom Devices
  $scope.show = function(device){

    for(index=0; index<Devices.length; index++){
      if(Devices[index].typeOfDevice == device.typeOfDevice && Devices[index].brand == device.brand && Devices[index].room == device.room){
        $rootScope.selected = index;
        break;
      }
    }

    $rootScope.temp = Devices[$rootScope.selected].temp;
    $rootScope.fanOption = Devices[$rootScope.selected].fanOption;
    $scope.modeOption = Devices[$rootScope.selected].modeOption;
    console.log(Devices[$rootScope.selected].modeOption == $scope.modes[1]);

    switch(device.typeOfDevice){
      case "AC": $state.go('app.ACPanel'); break;
      case "TV": $state.go('app.TVPanel'); break;
      case "SettopBox": $state.go('app.SettopBoxPanel'); break;
    }
  }

  $scope.getDevices = function(room){
    $rootScope.selectedRoom = room;
    if(User.rooms.indexOf(room) == -1){
      Devices.getDevices(room);
      User.rooms.push(room);
    }
  }


  $timeout(animations, 300);
})


.controller('NewDeviceCtrl', function($scope, $rootScope, $firebaseArray, $timeout, ionicMaterialInk, ionicMaterialMotion, User, Device){

  var ref = new Firebase("https://simpledb.firebaseio.com/");
  $rootScope.ACs = "";
  $scope.deviceslist = $firebaseArray(ref.child("models"));
  $scope.deviceslistchild = $firebaseArray(ref.child("models").child($rootScope.typeOfDevice));

  // Set Ink
  ionicMaterialInk.displayEffect();
  $timeout(function(){
  // Set Motion
  ionicMaterialMotion.ripple();
  }, 300);
})

.controller('AboutUsCtrl', function($scope, User) {

  $scope.latitude = User.position.latitude;
  $scope.longitude = User.position.longitude;
  
})

.controller('SettingsCtrl', function($scope, $http, User){
  $scope.email = User.logedUser.password.email;
  $scope.password = User.logedUser.provider;

  var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };

  var onSuccess = function(position) {
    var date = new Date();
    //date = date.toUTCString();
    User.position.latitude = position.coords.latitude;
    User.position.longitude = position.coords.longitude;
    var ref = new Firebase("https://simpledb.firebaseio.com/");
    if(User.logedUser.uid)
    ref.child("users").child(User.logedUser.uid).child("locations").child(new Date().toUTCString()).set({latitude: position.coords.latitude, longitude: position.coords.longitude});
  }
    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);


});


function sendCommand(){
  var slider = angular.element(document.getElementById("slider")).scope();
  slider.sendCommand(404);
};