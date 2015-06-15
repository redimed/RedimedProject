angular.module("starter.menu",["starter.menu.controller"])
    .config(function($stateProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                cache: false,
                views:{
                    'root':{
                        templateUrl: "modules/menu/views/menu.html",
                        controller: 'menuController'
                    }
                }
            })
    })