angular.module('Chockie.services', ['ionic', 'firebase'])

.factory('User',
function ($firebaseAuth, $firebaseArray, $timeout, $state, $ionicLoading, $ionicSideMenuDelegate) {

    var ref = new Firebase("https://simpledb.firebaseio.com/");
    var auth = $firebaseAuth(ref);
    var User = {logedUser: "", rooms: [], position: {latitude: "", longitude: ""}};

    User.signIn = function (user) {
       	if (user && user.email && user.password) {
        $ionicLoading.show({
            template: 'Signing In...'
        });
        auth.$authWithPassword({
            email: user.email,
            password: user.password
        }).then(function (authData) {
            $ionicSideMenuDelegate.canDragContent(true);
            User.logedUser = authData;
            $ionicLoading.hide();
            $state.go('app.yourrooms');
            localStorage.setItem("email", user.email); 
            localStorage.setItem("pass", user.password);
            $timeout(function(){
                delete user.email;
                delete user.password;
            }, 800);
         }).catch(function (error) {
            alert("Authentication failed:" + error.message);
            $ionicLoading.hide();
        });
        } else
            alert("Please enter email and password both");
    }

    User.createUser = function(user) {
        if (user && user.email && user.password && user.secondpassword == user.password) {
            $ionicLoading.show({
            template: 'Signing Up...'
        });

        auth.$createUser({
            email: user.email,
            password: user.password
        }).then(function (userData) {
            ref.child("users").child(userData.uid).set({
                email: user.email,
                password: user.password,
                deivces: "",
                rooms: "",
                command: 404
            });
            $ionicLoading.hide();
            User.signIn(user);
            $timeout(function(){
                delete user.email;
                delete user.password;
                delete user.secondpassword;
            }, 800);
        }).catch(function (error) {
            alert("Error: " + error);
            $ionicLoading.hide();
        });
    } else
        alert("Please fill all details");
    }

    User.logout = function () {
        $ionicLoading.show({
            template: 'Logging Out...'
        });
        auth.$unauth();
        localStorage.removeItem("email");
        localStorage.removeItem("pass");
        $ionicSideMenuDelegate.canDragContent(false);
        $ionicLoading.hide();
        $state.go('app.login');
    }

    return User;
})

.factory('Device', function ($firebaseArray, $firebaseObject, $http, User) {

    return function(){

    var ref = new Firebase("https://simpledb.firebaseio.com/");
    
    this.typeOfDevice = "";
    this.brand = "";
    this.room = "";
    this.command = "";
    this.temp = 22;
    this.fanOption = "A";
    this.modeOption = "Hot";
    this.power = false;


    this.sendCommand = function(item){
        if(this.typeOfDevice == 'AC') var url = "https://serverapp-simpledomain.rhcloud.com/sendcommand/" + String(User.logedUser.uid) + "/" + String(this.typeOfDevice) + String(this.brand) + "/Temp" + String(this.temp) + String(this.fanOption) + "/" + String(this.codes);
        else var url = "https://serverapp-simpledomain.rhcloud.com/sendcommand/" + String(User.logedUser.uid) + "/" + String(this.typeOfDevice) + String(this.selectedbrand) + "/" + String(item) + "/" + String(this.codes);
        $http({
            method: 'GET',
            url: url
        })
        .then(function successCallback(response) {
            console.log(response);
            }, function errorCallback(error) {
        });
    }

    this.PowerOnOff = function(){
        if(this.power == false)
          var url = "https://serverapp-simpledomain.rhcloud.com/sendcommand/" + String(User.logedUser.uid) + "/" + String(this.typeOfDevice) + String(this.brand) + "/Power_OFF/" + String(this.codes);
        else var url = "https://serverapp-simpledomain.rhcloud.com/sendcommand/" + String(User.logedUser.uid) + "/" + String(this.typeOfDevice) + String(this.brand) + "/Power_ON/" + String(this.codes);
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            console.log(response);
          }, function errorCallback(response) {
            console.log(response);
        });
    }

    this.set = function(device){
        this.typeOfDevice = device.typeOfDevice;
        this.brand = device.brand;
        this.room = device.room;
    }

    }

})


.factory('Devices', function(User, Device, $firebaseArray, $firebaseObject){

    var ref = new Firebase("https://simpledb.firebaseio.com/");
    Devices = [];

    Devices.createDevice = function(device){

        var match=false;
        
        for(index=0;  index<Devices.length; index++){
            if(Devices[index].brand == device.brand && Devices[index].typeOfDevice == device.typeOfDevice && Devices[index].room == device.room)
            {
                match = true;
                alert("You already have this device!"); 
                break;
            }
        }

        if(!match)
        {
            ref.child("users").child(User.logedUser.uid).child("rooms").child(device.room).child(device.typeOfDevice).child(device.brand).update({name: device.brand});
            var newDevice = new Device();
            newDevice.set(device)
            Devices.push(newDevice);
        }
        
    }

    Devices.createRoom = function(device){

        var rooms = $firebaseArray(ref.child("users").child(User.logedUser.uid).child("rooms"));

        rooms.$loaded().then(function() {
            ref.child("users").child(User.logedUser.uid).child("rooms").child(device.room).update({name: "room" + rooms.length});
            ref.child("users").child(User.logedUser.uid).child("rooms").child(device.room).child(device.typeOfDevice).child(device.brand).update({name: device.brand});
        });
    
    }

    Devices.getDevices = function(room){
        var AC = $firebaseArray(ref.child("users").child(User.logedUser.uid).child("rooms").child(room).child("AC"));
        var TV = $firebaseArray(ref.child("users").child(User.logedUser.uid).child("rooms").child(room).child("TV"));
        var SettopBox = $firebaseArray(ref.child("users").child(User.logedUser.uid).child("rooms").child(room).child("SettopBox"));
        DevicesInRoom = [];

        SettopBox.$loaded().then(function(){

        for(var index=0; index < AC.length; index++) {
            var device = {typeOfDevice: "AC", brand: AC[index].name, room: room};
            var newDevice = new Device();
            newDevice.set(device)
            Devices.push(newDevice);
        }

        for(var index=0; index < TV.length; index++) {
            var device = {typeOfDevice: "TV", brand: TV[index].name, room: room};
            var newDevice = new Device();
            newDevice.set(device)
            Devices.push(newDevice); 
        }

        for(var index=0; index < SettopBox.length; index++) {
            var device = {typeOfDevice: "SettopBox", brand: SettopBox[index].name, room: room}; 
            var newDevice = new Device();
            newDevice.set(device)
            Devices.push(newDevice); 
        }
        
        });
    }

    return Devices;
});