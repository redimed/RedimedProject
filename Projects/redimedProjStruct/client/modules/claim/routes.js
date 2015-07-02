angular.module('app.loggedIn.claim', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.claim', {
			url: '/claimload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					 async.waterfall([
                        function(callback) {
                            $ocLazyLoad.load("modules/claim/extend_routes.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                           $ocLazyLoad.load("modules/claim/controllers/ClaimPatientListController.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/claim/directives/ClaimPatientAddDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                           $ocLazyLoad.load("modules/claim/directives/ClaimPatientEditDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/claim/directives/ClaimPatientListDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                           $ocLazyLoad.load("modules/claim/directives/ClaimPatientShowDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $state.go('loggedIn.claim_list');
                        }
                    ]);
				}
			}
		})

		.state('loggedIn.patient.claim', {
			url: '/claimload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					 async.waterfall([
                        function(callback) {
                            $ocLazyLoad.load("modules/claim/extend_routes.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                           $ocLazyLoad.load("modules/claim/controllers/ClaimPatientListController.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/claim/directives/ClaimPatientAddDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                           $ocLazyLoad.load("modules/claim/directives/ClaimPatientEditDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/claim/directives/ClaimPatientListDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                           $ocLazyLoad.load("modules/claim/directives/ClaimPatientShowDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                           $state.go('loggedIn.patient.claim_list');
                        }
                    ]);
				}
			}
		})


})