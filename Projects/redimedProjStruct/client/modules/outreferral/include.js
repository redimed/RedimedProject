angular.module('app.loggedIn.outreferral.include', [
	'app.loggedIn.outreferral.directives.patientList',
	'app.loggedIn.outreferral.directives.patientAdd',
	'app.loggedIn.outreferral.directives.patientEdit',
	
	'app.loggedIn.outreferral.directives.patientShow',
	'app.loggedIn.outreferral.controllers.patientList',

	'app.loggedIn.outreferral.model'
])