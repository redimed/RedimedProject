angular.module("app.loggedIn.patient.consult", [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.patient.consult', {
			url: '/consultload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){

						$ocLazyLoad.load("modules/script/extend_routes.js");
		                $ocLazyLoad.load("modules/script/controllers/ScriptListController.js");
		                $ocLazyLoad.load("modules/script/controllers/ScriptAddController.js");
		                $ocLazyLoad.load("modules/script/controllers/ScriptEditController.js");
		                $ocLazyLoad.load("modules/script/directives/ScriptListDirective.js");
		                $ocLazyLoad.load("modules/script/directives/ScriptAddDirective.js");
		                $ocLazyLoad.load("modules/script/directives/ScriptEditDirective.js");
		                //END SCRIPT
		                //Referral
					    $ocLazyLoad.load("modules/referral/extend_routes.js");
					    $ocLazyLoad.load("modules/referral/controllers/referralController.js");
					    $ocLazyLoad.load("modules/referral/controllers/referralListController.js");
					    $ocLazyLoad.load("modules/referral/directives/ReferralDetailDirective.js");
					    $ocLazyLoad.load("modules/referral/directives/ReferralDirectives.js");
					    $ocLazyLoad.load("modules/referral/directives/ReferralSearchDirective.js");
					    //End Referral
					    $ocLazyLoad.load('modules/consultation/extend_routes.js');
					    $ocLazyLoad.load('modules/consultation/controllers/ConsultHistoryController.js');
					    $ocLazyLoad.load('modules/consultation/controllers/CorrespondenceAddController.js');
					    $ocLazyLoad.load('modules/consultation/controllers/CorrespondenceEditController.js');
					    $ocLazyLoad.load('modules/consultation/controllers/CorrespondenceController.js');
					    $ocLazyLoad.load('modules/consultation/controllers/MeasurementController.js');
					    $ocLazyLoad.load('modules/consultation/controllers/PatientConsultController.js');
					    $ocLazyLoad.load('modules/consultation/controllers/PatientConsultItemsheetController.js');
					    $ocLazyLoad.load('modules/consultation/controllers/ScriptController.js');
					    $ocLazyLoad.load('modules/consultation/directives/ConsultationDirectives.js');
					    $ocLazyLoad.load('modules/consultation/directives/CorrespondenceAddDirectives.js');
					    $ocLazyLoad.load('modules/consultation/directives/CorrespondenceDirectives.js');
					    $ocLazyLoad.load('modules/consultation/directives/CorrespondenceEditDirectives.js');
					    $ocLazyLoad.load('modules/consultation/directives/ExerciseDirectives.js');
					    $ocLazyLoad.load("modules/doctor/controllers/DoctorPaperlessController.js")

					.then(function(){
						$state.go('loggedIn.patient.consult_load');
					})
				}
			}
		})


})