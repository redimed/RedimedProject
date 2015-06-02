angular.module('starter.driver',[
    'starter.driver.services',
    'starter.driver.controller'
])
    .config(function ($stateProvider){
        $stateProvider
            .state('app.driver',{
                url: "/driver",
                cache: false,
                views: {
                    'menuContent' : {
                        templateUrl: "modules/driver/views/structure.html",
                        controller: "DriverController"
                    }
                }
            })
            .state('app.driver.list',{
                url:"/list",
                cache: false,
                views: {
                    'structure' : {
                        templateUrl: "modules/driver/views/listInjury.html"
                    }
                }
            })
            .state('app.driver.detailInjury',{
                url:"/detail_injury/:injuryID",
                cache: false,
                views: {
                    'structure' : {
                        templateUrl: "modules/driver/views/infoInjury.html"
                    }
                }
            })
            .state('app.driver.mapsPickup',{
                url:"/mapsPickup",
                cache: false,
                views:{
                    'structure':{
                        templateUrl:"modules/driver/views/mapsPickup.html"
                    }
                }
            })
    })

