angular.module('starter.phoneCall',[
    'starter.phoneCall.controller',
    'starter.phoneCall.services',
])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.phoneCall',{
                url: "/phoneCall/:callUser?isCaller",
                views: {
                    'menuContent' : {
                        templateUrl: "modules/phoneCall/views/main.html",
                        controller: "phoneCallController"
                    }
                }
            })
    })
