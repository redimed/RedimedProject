angular.module("starter.user",[
    'starter.user.services',
    'starter.user.controller'
])
.config(function($stateProvider){
        $stateProvider
            .state('app.profile',{
                url:"/profile",
                views:{
                    'menuContent':{
                        templateUrl:"modules/user/views/profile.html",
                        controller:'userProfileController'
                    }
                }
            })
            .state('home', {
                url: "/home",
                templateUrl: "home.html",
                controller: 'HomeTabCtrl'
            })
    })
