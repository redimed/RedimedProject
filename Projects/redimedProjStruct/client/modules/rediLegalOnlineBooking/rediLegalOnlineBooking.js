angular.module('app.loggedIn.rlob',[])

.config(function($stateProvider){
    $stateProvider
        .state("loggedIn.rlob", {
            url: "/rlob",
            templateUrl: "modules/rediLegalOnlineBooking/views/rlob.html",
            controller: "rlobController"
        })
        .state('loggedIn.rlob.rlob_booking', {
            url: '/LoadBooking',
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
                    async.waterfall([
                        function(callback) {
                            //routes
                            alert('aaa');
                            $ocLazyLoad.load("modules/rediLegalOnlineBooking/extend_rediLegalOnlineBooking.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            //controller
                            $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_messagesController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_report_type1Controller.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_report_type2Controller.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_report_type3Controller.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_reportController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_admin_bookingListController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_admin_documentStatusSummaryController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_admin_redilegalUsersListController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_bookingController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_bookingDetailController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_bookingListController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_paperlessController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_patientDetailController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_rltypeController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_specialists_profilesController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlob_specialtiesController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlobBookingBehalfController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/rlobController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/mobile/rlobCalendarMobileMasterController.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                                //directives
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/directives/rlob_directive.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $state.go('loggedIn.rlob.rlob_booking_online');
                        }
                    ]);
                }
            }
        })
})