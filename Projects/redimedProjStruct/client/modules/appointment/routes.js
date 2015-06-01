angular.module('app.loggedIn.appointment', ['app.loggedIn.appointment.include'])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.appointment', {
			url: '/appointment',
			templateUrl: 'modules/appointment/views/index.html',
			controller: 'AppointmentController'
		})

		.state('loggedIn.appointment_doctor', {
			url: '/appointment/doctor/:doctorId',
			templateUrl: 'modules/appointment/views/doctor/index.html',
			controller: 'AppointmentDoctorController'
		})		

		/*.state('loggedIn.appointment.detail', {
			url: '/:appointmentId/patient/:patientId',
			views: {
				'main-content@loggedIn': {
					templateUrl: 'modules/appointment/views/detail.html',
					controller: 'AppointmentDetailController'
				}
			}
		})*/
})