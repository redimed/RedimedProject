angular.module('starter.security',[
    'starter.security.services',
    'starter.security.controller'
])
.config(function($stateProvider){
        $stateProvider
            .state('security',{
                abstract:true,
                views:{
                    'root':{
                        templateUrl:'modules/security/views/structure.html',
                        controller:'securityController'
                    }
                }
            })
            .state('security.login',{
                
                url:'/login',
                views:{
                    'main-content':{
                        templateUrl:'modules/security/views/login.html',
                        controller:'securityLoginController'
                    }
                }
            })
            .state('security.rlobEmergency',{
                 cache: false,
                url:'/rlobEmergency',
                views:{
                    'main-content':{
                        templateUrl:'modules/security/views/rlobEmergency.html',
                        controller:'rlobEmergencyController'
                    }
                }
            })
             .state('security.rlobEmergencySuccess',{
                 cache: false,
                url:'/rlobEmergencySuccess',
                views:{
                    'main-content':{
                        templateUrl:'modules/security/views/rlobEmergencySuccess.html',
                        controller:'securityController'
                    }
                }
            })
            .state('security.rlobNonEmergency',{
                cache: false,
                url:'/rlobNonEmergency',
                views:{
                    'main-content':{
                        templateUrl:'modules/security/views/rlobNonEmergency.html',
                        controller:'rlobNonEmergencyController'
                    }
                }
            })
             .state('security.rlobNonEmergency.NEInfo',{
                 cache: false,
                url:'/NonEmergencyInfo',
                views:{
                    'non-emergency':{
                        templateUrl:'modules/security/views/NonEmergencyInfo.html',
                       
                    }
                }
            })
             .state('security.rlobNonEmergency.rlobNonEmergencySuccess',{
                cache: false,
                url:'/rlobNonEmergencySuccess',
                views:{
                    'non-emergency':{
                        templateUrl:'modules/security/views/rlobNonEmergencySuccess.html',
                       
                    }
                }
            })
            .state('security.rlobNonEmergency.rlobBooking',{
                url:'/rlobBooking',
                views:{
                    'non-emergency':{
                        templateUrl:'modules/security/views/rlobBooking.html',
                       
                    }
                }
            })
             .state('security.rlobNonEmergency.rlobBookingType',{
                url:'/rlobBookingType',
                views:{
                    'non-emergency':{
                        templateUrl:'modules/security/views/rlobBookingType.html',
                    }
                }
            })
           
            .state('security.rlobNonEmergency.rlobBookingDetail',{
                url:'/rlobBookingDetail',
                views:{
                    'non-emergency':{
                        templateUrl:'modules/security/views/rlobBookingDetail.html',
                       
                    }
                }
            })

           
    
           

    })