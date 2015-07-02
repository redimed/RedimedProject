angular.module('app.loggedIn.script', [])

.config(function($stateProvider){
	$stateProvider

	.state('loggedIn.patient.script', {
		url: '/scriptLoad',
		resolve: {
			init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
				async.waterfall([
					function(callback){
						$ocLazyLoad.load("modules/script/extend_routes.js")
						.then(function() {
							callback(null);
						})
					},
					function(callback){
						$ocLazyLoad.load("modules/script/controllers/ScriptListController.js")
						.then(function() {
							callback(null);
						})
					},
					function(callback){
						$ocLazyLoad.load("modules/script/controllers/ScriptAddController.js")
						.then(function() {
							callback(null);
						})
					},
					function(callback){
						$ocLazyLoad.load("modules/script/controllers/ScriptEditController.js")
						.then(function() {
							callback(null);
						})
					},
					function(callback){
						$ocLazyLoad.load("modules/script/directives/ScriptListDirective.js")
						.then(function() {
							callback(null);
						})
					},
					function(callback){
						$ocLazyLoad.load("modules/script/directives/ScriptAddDirective.js")
						.then(function() {
							callback(null);
						})
					},
					function(callback){
						$ocLazyLoad.load("modules/script/directives/ScriptEditDirective.js")
						.then(function() {
							callback(null);
						})
					},
					function(callback) {
						$state.go('loggedIn.patient.script_list');
					}
				]);
			}
		}
	})

})