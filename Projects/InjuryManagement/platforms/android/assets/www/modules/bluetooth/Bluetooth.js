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
                        templateUrl: "modules/bluetooth/views/main.html",
                        controller: "mainBlueController"
                    }
                }
            })
            .state('app.detailDeviceBluetooth',{
                url: "/detailDevice/:deviceType/:address",
                views: {
                    'menuContent' : {
                        templateUrl: "modules/bluetooth/views/detailDevice.html",
                        controller: "detailDeviceBlueController"
                    }
                }
            })
    })