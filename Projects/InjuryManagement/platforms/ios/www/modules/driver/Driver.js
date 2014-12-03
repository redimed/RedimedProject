angular.module('starter.driver',[
    'starter.driver,services',
    'starter.driver.controller'
])

    .config(function ($stateProvider){
        $stateProvider
            .state('app.driver',{
                url: "/driver",
                views: {

                }
            })
    })

