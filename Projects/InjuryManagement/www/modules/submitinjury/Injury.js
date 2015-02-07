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
            .state('app.injury.desInjury', {
                url: "/des_injury",
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/desinjury.html"
                    }
                }
            })
            .state('app.injury.desInjurySuccess', {
                url: "/successInjury",
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/successinjury.html"
                    }
                }
            })
            .state('app.injury.modelBody', {
                url: "/modelbody",
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/modelBody.html"
                    }
                }
            })
	    .state('app.injury.mapCompany',{
                url:"/mapCompany",
                views:{
                    'main':{
                        templateUrl:"modules/submitinjury/views/mapCompany.html"
                    }
                }
            })
    })