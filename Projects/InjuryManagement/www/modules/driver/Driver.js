angular.module('starter.driver',[
    'starter.driver.services',
    'starter.driver.controller',
    'starter.driverdetail.controller'
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
                 cache: false,
                url:"/list",
                views: {
                    'structure' : {
                        templateUrl: "modules/driver/views/listInjury.html"
                    }
                }
            })
            .state('app.driver.detailInjury',{
                  cache: false,
                url:"/detail_injury/:injuryID",
                views: {
                    'structure' : {
                        templateUrl: "modules/driver/views/infoInjury.html",
                        controller:'detailInjuryController'
                    }
                }
            })
            .state('app.driver.mapsPickup',{
                 cache: false,
                url:"/mapsPickup",
                views:{
                    'structure':{
                        templateUrl:"modules/driver/views/mapsPickup.html"
                    }
                }
            })
    })

