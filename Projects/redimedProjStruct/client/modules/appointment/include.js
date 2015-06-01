angular.module('app.loggedIn.appointment.include', [
	'app.loggedIn.appointment.models',
	'app.loggedIn.appointment.controllers.index',
	'app.loggedIn.appointment.controllers.detail',
	'app.loggedIn.appointment.controllers.doctor',

	'app.loggedIn.appointment.directives.calendar',
	'app.loggedIn.appointment.directives.add'
])