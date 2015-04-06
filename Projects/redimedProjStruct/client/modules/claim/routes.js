angular.module('app.loggedIn.claim', [
	'app.loggedIn.claim.include'
])

.config(function($stateProvider){

	$stateProvider

	.state('loggedIn.patient.claim', {
		abstract: true,
		url: '/:patientId/cal/:calId/claim'
	})

	.state('loggedIn.patient.claim.list', {
		url: '/list',
		views: {
			'main-content@loggedIn.patient': {
				templateUrl: 'modules/claim/views/patient/list.html',
				controller: 'ClaimPatientListController'
			}
		}
	})

})