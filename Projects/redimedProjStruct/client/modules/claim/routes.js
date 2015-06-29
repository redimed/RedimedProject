angular.module('app.loggedIn.claim', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.claim', {
			url: '/claimload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/claim/extend_routes.js");
					$ocLazyLoad.load("modules/claim/controllers/ClaimPatientListController.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientAddDirective.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientEditDirective.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientListDirective.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientShowDirective.js")
					.then(function(){
						$state.go('loggedIn.claim_list');
					})
				}
			}
		})

		.state('loggedIn.patient.claim', {
			url: '/claimload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/claim/extend_routes.js");
					$ocLazyLoad.load("modules/claim/controllers/ClaimPatientListController.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientAddDirective.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientEditDirective.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientListDirective.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientShowDirective.js")
					.then(function(){
						$state.go('loggedIn.patient.claim_list');
					})
				}
			}
		})


})