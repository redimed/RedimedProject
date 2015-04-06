angular.module('app.loggedIn.alert.include', [
	'app.loggedIn.alert.controllers.list',
	'app.loggedIn.alert.controllers.patientList',

	'app.loggedIn.alert.model',

	'app.loggedIn.alert.directives.patientList',
	'app.loggedIn.alert.directives.list',
	'app.loggedIn.alert.directives.add',
	'app.loggedIn.alert.directives.edit'
])