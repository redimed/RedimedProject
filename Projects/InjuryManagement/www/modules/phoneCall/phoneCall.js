angular.module('starter.phoneCall',[
    'starter.phoneCall.controller',
    'starter.phoneCall.services',
])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.phoneCall',{
                url: "/phoneCall/:contactName?isCalling",
                views: {
                    'menuContent' : {
                        templateUrl: "modules/phoneCall/views/main.html",
                        controller: "phoneCallController"
                    }
                }
            })
    })