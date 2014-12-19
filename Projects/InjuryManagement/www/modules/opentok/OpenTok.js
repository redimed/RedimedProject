angular.module('starter.opentok',[
    'starter.opentok.services',
    'starter.opentok.controller'
])
    .config(function ($stateProvider){
        $stateProvider
            .state('app.opentok',{
                url: "/opentok",
                views: {
                    'menuContent' : {
                        templateUrl: "modules/opentok/views/structure.html",
                        controller: "OpenTokController"
                    }
                }
            })
            .state('app.opentok.main',{
                url:"/list",
                views: {
                    'structure' : {
                        templateUrl: "modules/opentok/views/list.html"
                    }
                }
            })
            .state('app.opentok.detailCall',{
                url:"/detailCall",
                views: {
                    'structure' : {
                        templateUrl: "modules/opentok/views/main.html"
                    }
                }
            })
    })

