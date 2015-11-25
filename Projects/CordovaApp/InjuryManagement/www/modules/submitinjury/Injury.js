angular.module('starter.injury', [
    'starter.injury.controller',
    'starter.injury.services',
    'starter.historyInjury.controller',
    'starter.historyDetailInjury.controller'
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
                url: "/des_injury/:workeradd",
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
                        templateUrl:"modules/submitinjury/views/historyInjury.html",
                        controller:"HistoryInjuryController"
                    }
                }
            })
            .state('app.injury.historyDetail',{
                url:"/historyDetail/:injuryID",
                cache: false,
                views:{
                    'main':{
                        templateUrl:"modules/submitinjury/views/historyDetail.html",
                        controller:'HistoryDetailInjury'
                    }
                }
            })
    })