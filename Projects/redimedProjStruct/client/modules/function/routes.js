angular.module('app.loggedIn.function', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.function', {
			url: '/functionload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/function/extend_routes.js");
					$ocLazyLoad.load("modules/function/controllers/FunctionController.js")
					.then(function(){
						$state.go('loggedIn.function_list');
					})
				}
			}
		})
})