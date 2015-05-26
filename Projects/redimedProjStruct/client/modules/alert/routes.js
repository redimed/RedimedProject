angular.module('app.loggedIn.alert', [
	'app.loggedIn.alert.include'
])

.config(function($stateProvider){

	$stateProvider

	.state('loggedIn.alert', {
		url: '/alert',
		templateUrl: 'modules/alert/views/list.html',
		controller: 'AlertListController'
	})

	.state('loggedIn.patient.alert', {
		abstract: true,
		url: '/patientalert'
	})

	.state('loggedIn.patient.alert.list', {
		url: '/list',
		views: {
			'main-content@loggedIn.patient': {
				templateUrl: 'modules/alert/views/patient/list.html',
				controller: 'AlertPatientListController'
			}
		}
	})

})