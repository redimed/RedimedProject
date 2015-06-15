angular.module('starter.phoneCall',[
    'starter.phoneCall.controller',
    'starter.phoneCall.services',
])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.phoneCall',{
                url: "/phoneCall/:callUser/:apiKey/:sessionID/:tokenID:?isCaller",
                cache: false,
                views: {
                    'menuContent' : {
                        templateUrl: "modules/phoneCall/views/main.html",
                        controller: "phoneCallController"
                    }
                }
            })
    })

