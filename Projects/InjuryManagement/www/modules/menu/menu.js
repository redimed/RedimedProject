angular.module("starter.menu",["starter.menu.controller"])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                views:{
                    'root':{
                        templateUrl: "modules/menu/views/menu.html",
                        controller: 'menuController'
                    }
                }
            })
    })