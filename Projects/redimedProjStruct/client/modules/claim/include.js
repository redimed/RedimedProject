angular.module('app.loggedIn.claim.include', [
	'app.loggedIn.claim.directives.patientList',
	'app.loggedIn.claim.directives.patientAdd',
	'app.loggedIn.claim.directives.patientEdit',
	
	'app.loggedIn.claim.controllers.patientList',
	'app.loggedIn.claim.directives.patientShow',

	'app.loggedIn.claim.model'
])