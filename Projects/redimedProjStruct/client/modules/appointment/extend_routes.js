angular.module('app.loggedIn.appointment')

.config(function($stateProvider){
	$stateProvider

	.state('loggedIn.appointment_list', {
		url: '/appointment',
		templateUrl: 'modules/appointment/views/index.html',
		controller: 'AppointmentController'
	})

	.state('loggedIn.appointment_doctor', {
		url: '/appointment/doctor/:doctorId',
		templateUrl: 'modules/appointment/views/doctor/index.html',
		controller: 'AppointmentDoctorController'
	})
})