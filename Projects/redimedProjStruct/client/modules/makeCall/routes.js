angular.module('app.loggedIn.calling', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.calling', {
			url: '/call',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/makeCall/extend_routes.js");
					$ocLazyLoad.load("modules/makeCall/controllers/callController.js");
				}
			}
		})


})