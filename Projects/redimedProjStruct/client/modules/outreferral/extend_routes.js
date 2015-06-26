angular.module('app.loggedIn.outreferral')

.config(function($stateProvider){

	$stateProvider
	.state('loggedIn.patient.outreferral_list', {
		abstract: true,
		url: '/outreferral'
		 //'/:patientId/cal/:calId/claim'
	})

	.state('loggedIn.patient.outreferral.list', {
		url: '/list',
		views: {
			'main-content@loggedIn.patient': {
				templateUrl: 'modules/outreferral/views/patient/list.html',
				controller: 'OutreferralPatientListController'
			}
		}
	})

})