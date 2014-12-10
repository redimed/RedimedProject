angular.module('starter.driver',[
    'starter.driver.services',
    'starter.driver.controller'
])
    .config(function ($stateProvider){
        $stateProvider
            .state('app.driver',{
                url: "/driver",
                views: {
                    'menuContent' : {
                        templateUrl: "modules/driver/views/structure.html",
                        controller: "DriverController"
                    }
                }
            })
            .state('app.driver.list',{
                url:"/list",
                views: {
                    'structure' : {
                        templateUrl: "modules/driver/views/listInjury.html"
                    }
                }
            })
            .state('app.driver.detailInjury',{
                url:"/detail_injury",
                views: {
                    'structure' : {
                        templateUrl: "modules/driver/views/infoInjury.html"
                    }
                }
            })
    })

