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
					
					//endtest
					$ocLazyLoad.load("modules/problem/extend_routes.js");
                    $ocLazyLoad.load("modules/problem/controllers/ProblemController.js");
                    $ocLazyLoad.load("modules/problem/controllers/ProblemListController.js");
                    $ocLazyLoad.load("modules/problem/directives/ProblemDetailDirective.js");
                    $ocLazyLoad.load("modules/problem/directives/ProblemDirective.js")
					//endtest
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