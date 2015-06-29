angular.module('app.loggedIn.claim')

.config(function($stateProvider){

	$stateProvider
	.state('loggedIn.claim_list', {
	})
	.state('loggedIn.patient.claim_list', {
		url: '/claim/list',
		views: {
			'main-content@loggedIn.patient': {
				templateUrl: 'modules/claim/views/patient/list.html',
				controller: 'ClaimPatientListController'
			}
		}
	})

})