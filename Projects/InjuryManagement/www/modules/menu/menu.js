angular.module("starter.menu",["starter.menu.controller"])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "modules/menu/views/menu.html",
                controller: 'menuController'
            })
    })