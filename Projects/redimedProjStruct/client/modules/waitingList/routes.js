angular.module('app.loggedIn.waitingList', [])

.config(function($stateProvider){

	$stateProvider
	.state('loggedIn.waitingList', {
		resolve: {
			init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
				async.waterfall([
					function(callback) {
						$ocLazyLoad.load('modules/waitingList/extend_routes.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/waitingList/directives/waitingListAddDirective.js')
							.then(function() {
								callback(null);
							});
					},
					function(callback) {

						$ocLazyLoad.load('modules/waitingList/directives/waitingListListDirective.js')
						.then(function() {
							callback(null);
						})
					}
				]);
			}
		}

	})


})