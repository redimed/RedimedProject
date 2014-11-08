angular.module("starter.browse",["starter.browse.controller"])
    .config(function($stateProvider){
        $stateProvider
            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent' :{
                        templateUrl: "modules/browse/views/browse.html",
                        controller:"browseController"
                    }
                }
            })
    })