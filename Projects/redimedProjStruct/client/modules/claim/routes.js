angular.module('app.loggedIn.claim', [
	'app.loggedIn.claim.include'
])

.config(function($stateProvider){

	$stateProvider

	.state('loggedIn.claim', {
		url: '/claim',
		templateUrl: 'modules/claim/views/index.html',
		controller: 'ClaimIndexController'
	})


})