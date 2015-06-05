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
                        templateUrl: 'modules/security/views/structure_register.html',
                        controller: 'securityRegisterController'
                    }
                }
            })
            .state('security.register.info1',{
                url:'/register_info1',
                cache: false,
                views:{
                    'wrap_register':{
                        templateUrl: 'modules/security/views/register_info1.html',
                    }
                }
            })
            .state('security.register.info2',{
                url:'/register_info2',
                cache: false,
                views:{
                    'wrap_register':{
                        templateUrl: 'modules/security/views/register_info2.html',
                    }
                }
            })
            .state('security.register.info3',{
                url:'/register_info3',
                cache: false,
                views:{
                    'wrap_register':{
                        templateUrl: 'modules/security/views/register_info3.html',
                    }
                }
            })
    })