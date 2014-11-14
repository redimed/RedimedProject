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
            .state('app.changePass', {
                url: "/changePass",
                views:{
                    'menuContent':{
                        templateUrl:"modules/user/views/changePassword.html",
                        controller:'userProfileController'
                    }
                }
            })
    })
