angular.module('starter.bluetooth',[
    'starter.bluetooth.services',
    'starter.bluetooth.mainBlueController',
    'starter.bluetooth.detailDeviceBlueController'
])
    .config(function ($stateProvider){
        $stateProvider
            .state('app.mainBluetooth',{
                url: "/mainBluetooth",
                views: {
                    'menuContent' : {
<<<<<<< HEAD
                        templateUrl: "modules/bluetooth/views/main.html",
                        controller: "mainBlueController"
=======
                        templateUrl: "modules/bluetooth/views/structure.html",
                        controller: "BluetoothController"
>>>>>>> FETCH_HEAD
                    }
                }
            })
            .state('app.detailDeviceBluetooth',{
                url: "/detailDevice/:id/:name/:address?status",
                views: {
<<<<<<< HEAD
                    'menuContent' : {
                        templateUrl: "modules/bluetooth/views/detailDevice.html",
                        controller: "detailDeviceBlueController"
=======
                    'main' : {
                        templateUrl: "modules/bluetooth/views/main.html"
>>>>>>> FETCH_HEAD
                    }
                }
            })
    })