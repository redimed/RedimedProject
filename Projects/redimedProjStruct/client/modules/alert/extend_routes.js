angular.module('app.loggedIn.alert')

.config(function($stateProvider){

	$stateProvider

	.state('loggedIn.alert_list', {
		url: '/alert',
		templateUrl: 'modules/alert/views/list.html',
		controller: 'AlertListController'
	})

	.state('loggedIn.patient.alert_list', {
		url: '/alert/list',
		views: {
			'main-content@loggedIn.patient': {
				templateUrl: 'modules/alert/views/patient/list.html',
				controller: 'AlertPatientListController'
			}
		}
	})

})