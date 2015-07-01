angular.module('app.loggedIn.vaccinob',[])

.config(function($stateProvider){
    $stateProvider
        .state("loggedIn.vaccinob", {
            url: "/vaccinob",
            templateUrl: "modules/rediLegalOnlineBooking/views/vaccinob.html",
            controller: "vaccinobController"
        })
        .state('loggedIn.vaccinob.vaccinob_booking', {
            url: '/LoadBooking',
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
                     async.waterfall([
                        function(callback) {
                            alert('aaa');
                            //routes
                            $ocLazyLoad.load("modules/rediLegalOnlineBooking/extend_vaccinOnlineBooking.js")
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
                                $ocLazyLoad.load("modules/rediLegalOnlineBooking/controllers/vaccinobController.js")
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
                            $state.go('loggedIn.vaccinob.vaccinob_booking_online');
                        }
                    ]);
                }
            }
        })
})