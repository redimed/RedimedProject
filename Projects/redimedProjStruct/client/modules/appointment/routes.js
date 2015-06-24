angular.module('app.loggedIn.appointment', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.appointment', {
			url: '/appoint',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/appointment/extend_routes.js");
					$ocLazyLoad.load("modules/appointment/controllers/AppointmentController.js");
					$ocLazyLoad.load("modules/appointment/models/AppointmentModel.js");
					$ocLazyLoad.load("modules/appointment/controllers/AppointmentDetailController.js");
					$ocLazyLoad.load("modules/appointment/controllers/AppointmentDoctorController.js");
					$ocLazyLoad.load("modules/appointment/directives/AppointmentCalendarDirective.js");
					$ocLazyLoad.load("modules/appointment/directives/AppointmentAddDirective.js")
					.then(function(){
						$state.go('loggedIn.appointment_list');
					})
				}
			}
		})


})