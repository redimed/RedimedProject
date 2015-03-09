/**
 * Created by Minh Hikari on 11/28/2014.
 */
angular.module('app.loggedIn.waworkcover', [
    'app.loggedIn.waworkcover.controller',
    'app.loggedIn.waworkcover.directive',
    'app.loggedIn.waworkcover.service'
])
    .config(function ($stateProvider) {
//        $stateProvider
//            .state("loggedIn.doctor.patients.detail.appt.waworkcover", {
//                abstract: true,
//                views: {
//                    "main-content@loggedIn.doctor": {
//                        templateUrl: "modules/waworkcover/views/structure.html",
//                        controller: "WaWorkCoverController"
//                    }
//                }
//            })
//
//        .state('loggedIn.doctor.patients.detail.appt.waworkcover.first', {
//            url: '/wa/workcover/first',
//            views: {
//                'main-content': {
//                    templateUrl: 'modules/waWorkCover/views/first.html',
//                    controller: 'WaWorkCoverFirstController'
//                }
//            }
//        })
//            .state('loggedIn.doctor.patients.detail.appt.waworkcover.progress', {
//                url: '/wa/workcover/progress',
//                views: {
//                    'main-content': {
//                        templateUrl: 'modules/waWorkCover/views/progress.html',
//                        controller: 'WaWorkCoverProgressController'
//                    }
//                }
//            })
//            .state('loggedIn.doctor.patients.detail.appt.waworkcover.final', {
//                url: '/wa/workcover/final',
//                views: {
//                    'main-content': {
//                        templateUrl: 'modules/waWorkCover/views/final.html',
//                        controller: 'WaWorkCoverFinalController'
//                    }
//                }
//            })
    
            $stateProvider
                .state("loggedIn.waworkcover", {
                    abstract: true,
                    templateUrl: "modules/waworkcover/views/structure.html",
                    controller: "WaWorkCoverController"

                })

                .state('loggedIn.waworkcover.first', {
                    url: '/wa/workcover/:patient_id/:cal_id/first/:action/:wc_id',
                    views: {
                        'main-content': {
                            templateUrl: 'modules/waworkcover/views/first.html',
                            controller: 'WaWorkCoverFirstController'
                        }
                    }
                })
                .state('loggedIn.waworkcover.progress', {
                    url: '/wa/workcover/:patient_id/:cal_id/progress/:action/:wc_id',
                    views: {
                        'main-content': {
                            templateUrl: 'modules/waworkcover/views/progress.html',
                            controller: 'WaWorkCoverProgressController'
                        }
                    }
                })
                .state('loggedIn.waworkcover.final', {
                    url: '/wa/workcover/:patient_id/:cal_id/final/:action/:wc_id',
                    views: {
                        'main-content': {
                            templateUrl: 'modules/waworkcover/views/final.html',
                            controller: 'WaWorkCoverFinalController'
                        }
                    }
                })
                .state('loggedIn.waworkcover.general',{
                    url:'/wa/workcover/:patient_id/:cal_id/general/:action/:wc_id',
                    views:{
                        'main-content':{
                            templateUrl: 'modules/waWorkCover/views/general.html',
                            controller: 'WaWorkCoverGeneralController'
                        }
                    }
                })
    });