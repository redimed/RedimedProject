angular.module('starter.bluetooth',[
    'starter.bluetooth.services',
    'starter.bluetooth.mainBlueController'
])
    .config(function ($stateProvider){
        $stateProvider
            .state('app.mainBluetooth',{
                url: "/mainBluetooth",
                cache: false,
                views: {
                    'menuContent' : {
                        templateUrl: "modules/bluetooth/views/main.html",
                        controller: "mainBlueController"
                    }
                }
            })
    })