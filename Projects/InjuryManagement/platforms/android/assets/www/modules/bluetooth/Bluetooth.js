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
                        controller: "DriverController"
                    }
                }
            })
            .state('app.bluetooth.main',{
                url: "/main",
                views: {
                    'content' : {
                        templateUrl: "modules/bluetooth/views/main.html"
                    }
                }
            })
    })