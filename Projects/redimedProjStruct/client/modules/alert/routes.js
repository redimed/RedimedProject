angular.module('app.loggedIn.alert', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.alert', {
			url: '/alertload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					async.waterfall([
						function(callback) {
							$ocLazyLoad.load("modules/alert/extend_routes.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/controllers/AlertListController.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/controllers/AlertPatientListController.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/directives/AlertAddDirective.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/directives/AlertEditDirective.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/directives/AlertListDirective.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/directives/AlertPatientListDirective.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$state.go('loggedIn.alert_list');
						}
					]);
				}
			}
		})

		.state('loggedIn.patient.alert', {
			url: '/alertpatientload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					async.waterfall([
						function(callback) {
							$ocLazyLoad.load("modules/alert/extend_routes.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/controllers/AlertListController.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/controllers/AlertPatientListController.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/directives/AlertAddDirective.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/directives/AlertEditDirective.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/directives/AlertListDirective.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load("modules/alert/directives/AlertPatientListDirective.js")
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$state.go('loggedIn.patient.alert_list');
						}
					]);
				}
			}
		})


})