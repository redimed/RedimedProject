angular.module('starter.injury', [
    'starter.injury.controller',
    'starter.injury.services',
])

    .config(function($stateProvider){
        $stateProvider
            .state('app.injury', {
                url: "/injury",
                cache: false,
                views: {
                    'menuContent' :
                    {
                        templateUrl: "modules/submitinjury/views/structure.html",
                        controller: "InjuryController"
                    }
                }
            })
            .state('app.injury.info', {
                url: "/info",
                cache: false,
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/info.html"
                    }
                }
            })
            .state('app.injury.desInjury', {
                url: "/des_injury",
                cache: false,
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/desinjury.html"
                    }
                }
            })
            .state('app.injury.desInjurySuccess', {
                url: "/successInjury",
                cache: false,
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/successinjury.html"
                    }
                }
            })
            .state('app.injury.modelBody', {
                url: "/modelbody",
                cache: false,
                views: {
                    'main': {
                        templateUrl: "modules/submitinjury/views/modelBody.html"
                    }
                }
            })
            .state('app.injury.mapCompany',{
                url:"/mapCompany",
                cache: false,
                views:{
                    'main':{
                        templateUrl:"modules/submitinjury/views/mapCompany.html"
                    }
                }
            })
            .state('app.injury.historyInjury',{
                url:"/historyInjury",
                cache: false,
                views:{
                    'main':{
                        templateUrl:"modules/submitinjury/views/historyInjury.html"
                    }
                }
            })
            .state('app.injury.historyDetail',{
                url:"/historyDetail",
                cache: false,
                views:{
                    'main':{
                        templateUrl:"modules/submitinjury/views/historyDetail.html"
                    }
                }
            })
    })