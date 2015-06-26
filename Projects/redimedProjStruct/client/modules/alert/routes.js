angular.module('app.loggedIn.alert', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.alert', {
			url: '/alertload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/alert/extend_routes.js");
					$ocLazyLoad.load("modules/alert/controllers/AlertListController.js");
					$ocLazyLoad.load("modules/alert/controllers/AlertPatientListController.js");
					$ocLazyLoad.load("modules/alert/directives/AlertAddDirective.js");
					$ocLazyLoad.load("modules/alert/directives/AlertEditDirective.js");
					$ocLazyLoad.load("modules/alert/directives/AlertListDirective.js");
					$ocLazyLoad.load("modules/alert/directives/AlertPatientListDirective.js")
					.then(function(){
						$state.go('loggedIn.alert_list');
					})
				}
			}
		})

		.state('loggedIn.patient.alert', {
			url: '/alertpatientload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/alert/extend_routes.js");
					$ocLazyLoad.load("modules/alert/controllers/AlertListController.js");
					$ocLazyLoad.load("modules/alert/controllers/AlertPatientListController.js");
					$ocLazyLoad.load("modules/alert/directives/AlertAddDirective.js");
					$ocLazyLoad.load("modules/alert/directives/AlertEditDirective.js");
					$ocLazyLoad.load("modules/alert/directives/AlertListDirective.js");
					$ocLazyLoad.load("modules/alert/directives/AlertPatientListDirective.js")
					.then(function(){
						$state.go('loggedIn.patient.alert_list');
					})
				}
			}
		})


})