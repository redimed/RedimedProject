angular.module('app.loggedIn.claim')

.config(function($stateProvider){

	$stateProvider
	.state('loggedIn.claim_list', {
	})
	.state('loggedIn.patient.claim', {
		abstract: true,
		url: '/claim'
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