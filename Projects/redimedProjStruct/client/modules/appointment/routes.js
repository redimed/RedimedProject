angular.module('app.loggedIn.appointment', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.appointment', {
			url: '/appoint',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/appointment/extend_routes.js");
					$ocLazyLoad.load("modules/appointment/controllers/AppointmentController.js");
					$ocLazyLoad.load("modules/appointment/controllers/AppointmentDetailController.js");
					$ocLazyLoad.load("modules/appointment/controllers/AppointmentDoctorController.js");
					$ocLazyLoad.load("modules/appointment/directives/AppointmentCalendarDirective.js");
					$ocLazyLoad.load("modules/appointment/directives/AppointmentAddDirective.js");
					
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientListDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientAddDirective.js");
					
					//endcompany
					$ocLazyLoad.load("modules/outreferral/extend_routes.js");
					$ocLazyLoad.load("modules/outreferral/controllers/OutreferralPatientListController.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientAddDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientEditDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientListDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientShowDirective.js");
					$ocLazyLoad.load("modules/outreferral/modules/OutreferralModel.js");
					//endcompany
					$ocLazyLoad.load("modules/patient/directives/PatientSearch.js");
					$ocLazyLoad.load("modules/patient/directives/PatientWaitingList.js");
					$ocLazyLoad.load("modules/waitingList/directives/waitingListAddDirective.js");
					$ocLazyLoad.load("modules/patient/directives/PatientDetail.js")
					.then(function(){
						$state.go('loggedIn.appointment_list');
					})
				}
			}
		})


})