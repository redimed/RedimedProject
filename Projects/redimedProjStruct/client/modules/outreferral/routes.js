angular.module('app.loggedIn.outreferral',[])

.config(function($stateProvider){
	$stateProvider
		.state('loggedIn.patient.outreferral', {
			url: '/outreferralload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					async.waterfall([
						function(callback) {
   							$ocLazyLoad.load("modules/outreferral/extend_routes.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/outreferral/controllers/OutreferralPatientListController.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientAddDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientEditDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientListDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientShowDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
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
   							$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorDetailDirective.js")
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
   							$ocLazyLoad.load("modules/mdtdoctor/extend_routes.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDetailDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDirectives.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorSearchDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/mdtspecialty/dialogs/mdtSpecialityListByDoctorDialog.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
							$state.go('loggedIn.patient.outreferral_list');
						}
						
					]);
				}
			}
		})


})