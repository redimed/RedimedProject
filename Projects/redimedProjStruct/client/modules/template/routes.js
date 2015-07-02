angular.module('app.loggedIn.template', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.template', {
			url: '/templateload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					async.waterfall([
						function(callback) {
							$ocLazyLoad.load('modules/template/extend_routes.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplateAddController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplateEditController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplateListController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplatePatientAddController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplatePatientListController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplatePatientWriteController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplateWriteController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplateAddDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplateEditDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplateListDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplatePatientAddDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplatePatientEditDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplatePatientListDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplatePatientWriteDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplateWriteDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$state.go('loggedIn.template_load');
						}
					]);
				}
			}
		})

		.state('loggedIn.patient.template', {
			url: '/patienttemplateload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					async.waterfall([
						function(callback) {
							$ocLazyLoad.load('modules/template/extend_routes.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplateAddController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplateEditController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplateListController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplatePatientAddController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplatePatientListController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplatePatientWriteController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/controllers/TemplateWriteController.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplateAddDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplateEditDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplateListDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplatePatientAddDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplatePatientEditDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplatePatientListDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplatePatientWriteDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							$ocLazyLoad.load('modules/template/directives/TemplateWriteDirective.js')
							.then(function() {
								callback(null);
							});
						},
						function(callback) {
							//alert('--');
							$state.go('loggedIn.patient.template_load');
						}
					]);
				}
			}
		})


})