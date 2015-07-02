angular.module("app.loggedIn.patient.consult", [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.patient.consult', {
			url: '/consultload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
						async.waterfall([
							function(callback) {
   								$ocLazyLoad.load("modules/script/extend_routes.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   								$ocLazyLoad.load("modules/script/controllers/ScriptListController.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   								$ocLazyLoad.load("modules/script/controllers/ScriptAddController.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							     $ocLazyLoad.load("modules/script/controllers/ScriptEditController.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							     $ocLazyLoad.load("modules/script/directives/ScriptListDirective.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load("modules/script/directives/ScriptAddDirective.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load("modules/script/directives/ScriptEditDirective.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load("modules/referral/extend_routes.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load("modules/referral/controllers/referralController.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load("modules/referral/controllers/referralListController.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load("modules/referral/directives/ReferralDetailDirective.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load("modules/referral/directives/ReferralDirectives.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load("modules/referral/directives/ReferralSearchDirective.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							     $ocLazyLoad.load('modules/consultation/extend_routes.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/controllers/ConsultHistoryController.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/controllers/CorrespondenceAddController.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/controllers/CorrespondenceEditController.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/controllers/CorrespondenceController.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							     $ocLazyLoad.load('modules/consultation/controllers/MeasurementController.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/controllers/PatientConsultController.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/controllers/PatientConsultItemsheetController.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/controllers/ScriptController.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/directives/ConsultationDirectives.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/directives/CorrespondenceAddDirectives.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/directives/CorrespondenceDirectives.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							     $ocLazyLoad.load('modules/consultation/directives/CorrespondenceEditDirectives.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load('modules/consultation/directives/ExerciseDirectives.js')
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
   							    $ocLazyLoad.load("modules/doctor/controllers/DoctorPaperlessController.js")
							    .then(function() {
							        callback(null);
							    });
							},
							function(callback) {
								$state.go('loggedIn.patient.consult_load');
							}

						])
				}
			}
		})
})