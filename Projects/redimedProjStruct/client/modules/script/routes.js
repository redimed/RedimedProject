angular.module('app.loggedIn.script', [])

.config(function($stateProvider){
	$stateProvider

	.state('loggedIn.patient.script', {
		url: '/scriptLoad',
		resolve: {
			init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
				$ocLazyLoad.load("modules/script/extend_routes.js");
				$ocLazyLoad.load("modules/script/controllers/ScriptListController.js");
				$ocLazyLoad.load("modules/script/controllers/ScriptAddController.js");
				$ocLazyLoad.load("modules/script/controllers/ScriptEditController.js");
				$ocLazyLoad.load("modules/script/directives/ScriptListDirective.js");
				$ocLazyLoad.load("modules/script/directives/ScriptAddDirective.js");
				$ocLazyLoad.load("modules/script/directives/ScriptEditDirective.js")
				.then(function(){
					$state.go('loggedIn.patient.script_list');
				})
			}
		}
	})

})