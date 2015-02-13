angular.module('starter.bluetooth',[
    'starter.bluetooth.services',
    'starter.bluetooth.controller'
])
    .config(function ($stateProvider){
        $stateProvider
            .state('app.bluetooth',{
                url: "/bluetooth",
                views: {
                    'menuContent' : {
                        templateUrl: "modules/bluetooth/views/structure.html",
                        controller: "BluetoothController"
                    }
                }
            })
            .state('app.bluetooth.main',{
                url: "/main",
                views: {
                    'main' : {
                        templateUrl: "modules/bluetooth/views/main.html"
                    }
                }
            })
    })