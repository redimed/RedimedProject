angular.module("starter.user",[
    'starter.user.services',
    'starter.user.controller',
    'starter.ListWorker.controller',
    'starter.detailWorker.controller'
])
    .config(function($stateProvider){
        $stateProvider
            .state('app.profile',{
                url:"/profile",
                cache: false,
                views:{
                    'menuContent':{
                        templateUrl:"modules/user/views/profile.html",
                        controller:'userProfileController'
                    }
                }
            })
            .state('app.changePass', {
                url: "/changePass",
                cache: false,
                views:{
                    'menuContent':{
                        templateUrl:"modules/user/views/changePassword.html",
                        controller:'userProfileController'
                    }
                }
            })
            .state('app.listWorker', {
                url: "/listWorker",
                cache: false,
                views:{
                    'menuContent':{
                        templateUrl:"modules/user/views/ListWorker.html",
                        controller:'ListWorkerController'
                    }
                }
            })
            .state('app.detailWorker', {
                url: "/detailWorker/:patientID",
                cache: false,
                views:{
                    'menuContent':{
                        templateUrl:"modules/user/views/DetailWorker.html",
                        controller:'detailWorkerController'
                    }
                }
            })
    })
