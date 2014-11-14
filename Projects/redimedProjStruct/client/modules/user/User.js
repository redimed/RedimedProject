angular.module("app.loggedIn.user",[
    "app.loggedIn.user.services",
    "app.loggedIn.user.profile.controller"
])

.config(function($stateProvider){
    $stateProvider
        .state('loggedIn.userProfile',{
            url:'/users/profile',
            templateUrl:'modules/user/views/profile.html',
            controller:'UserProfileController'
        })
})

