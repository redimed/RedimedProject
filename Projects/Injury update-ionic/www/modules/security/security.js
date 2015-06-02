angular.module('starter.security',[
    'starter.security.services',
    'starter.security.controller'
])
    .config(function($stateProvider){
        $stateProvider
            .state('security',{
                abstract:true,
                cache: false,
                views:{
                    'root':{
                        templateUrl: 'modules/security/views/structure.html',
                        controller: 'securityController'
                    }
                }
            })
            .state('security.login',{
                url:'/login',
                cache: false,
                views:{
                    'main-content':{
                        templateUrl: 'modules/security/views/login.html',
                        controller: 'securityLoginController'
                    }
                }
            })
            .state('security.forgot',{
                url:'/forgot',
                cache: false,
                views:{
                    'main-content':{
                        templateUrl: 'modules/security/views/forgot.html',
                        controller: 'securityForgotController'
                    }
                }
            })
            .state('security.register',{
                url:'/register',
                cache: false,
                views:{
                    'main-content':{
                        templateUrl: 'modules/security/views/register.html',
                        controller: 'securityRegisterController'
                    }
                }
            })
    })