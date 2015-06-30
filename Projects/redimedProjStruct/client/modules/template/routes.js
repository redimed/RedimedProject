angular.module('app.loggedIn.template', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.template', {
			url: '/templateload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/template/extend_routes.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateAddController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateEditController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateListController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientAddController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientListController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientWriteController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateWriteController.js");

					$ocLazyLoad.load("modules/template/directives/TemplateAddDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateEditDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateListDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientAddDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientEditDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientListDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientWriteDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateWriteDirective.js")
					.then(function(){
						$state.go('loggedIn.template_load');
					})
				}
			}
		})

		.state('loggedIn.patient.template', {
			url: '/patienttemplateload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/template/extend_routes.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateAddController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateEditController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateListController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientAddController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientListController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientWriteController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateWriteController.js");

					$ocLazyLoad.load("modules/template/directives/TemplateAddDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateEditDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateListDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientAddDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientEditDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientListDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientWriteDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateWriteDirective.js")
					.then(function(){
						alert('--');
						$state.go('loggedIn.patient.template_load');
					})
				}
			}
		})


})