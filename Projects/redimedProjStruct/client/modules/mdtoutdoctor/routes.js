angular.module('app.loggedIn.mdtoutdoctor', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.mdtoutdoctor', {
			url: '/mdtoutdoctorload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					async.waterfall([
						function(callback) {
							     $ocLazyLoad.load("modules/mdtoutdoctor/extend_routes.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
							$ocLazyLoad.load("modules/mdtoutdoctor/dialogs/MdtoutdoctorAdddialog.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
							$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorAddDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
							$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorDirectives.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
							$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorSearchDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
							$state.go('loggedIn.mdtoutdoctor_load');
						}
					]);
				}
			}
		})


})