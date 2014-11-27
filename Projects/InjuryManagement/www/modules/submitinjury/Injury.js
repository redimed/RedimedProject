angular.module('starter.injury', [
    'starter.injury.add.controller',
    'starter.injury.services',
])

    .config(function($stateProvider){
        $stateProvider
            .state('app.injury', {
                url: "/injury",
                views: {
                    'menuContent' :
                    {
                        templateUrl: "modules/submitinjury/views/structure.html",
                        controller: "InjuryAddController"
                    }
                }
            })
            .state('app.injury.info', {
                url: "/info",
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/info.html"
                    }
                }

            })
            .state('app.injury.desinjury', {
                url: "/desinjury",
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/desinjury.html"
                    }
                }
            })
            .state('app.injury.desinjurySuccess', {
                url: "/successInjury",
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/successinjury.html"
                    }
                }
            })
    })