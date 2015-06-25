angular.module('app.loggedIn.company', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.company', {
			url: '/companyload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/company/extend_routes.js");
					$ocLazyLoad.load("modules/company/models/CompanyModel.js");
					$ocLazyLoad.load("modules/company/services/CompanyServices.js");
					$ocLazyLoad.load("modules/company/controllers/CompanyAddController.js");
					$ocLazyLoad.load("modules/company/controllers/CompanyEditController.js");
					$ocLazyLoad.load("modules/company/controllers/CompanyListController.js");
					$ocLazyLoad.load("modules/company/controllers/CompanyListInsurerController.js");
					$ocLazyLoad.load("modules/company/controllers/CompanyListNotFollowController.js");
					$ocLazyLoad.load("modules/company/controllers/CompanyListParentController.js");


					$ocLazyLoad.load("modules/company/dialogs/CompanyAddNewInsurerDialgosController.js");
					$ocLazyLoad.load("modules/company/dialogs/CompanyAddParentDialgosController.js");
					$ocLazyLoad.load("modules/company/dialogs/CompanyInsurerDialgosController.js");
					$ocLazyLoad.load("modules/company/dialogs/CompanyListNoFollowDialog.js");
					$ocLazyLoad.load("modules/company/dialogs/CompanyRemoveDialog.js");

					$ocLazyLoad.load("modules/company/directives/CompanyAddDirective.js");
					$ocLazyLoad.load("modules/company/directives/CompanyAddNotFollowDirective.js");
					$ocLazyLoad.load("modules/company/directives/CompanyEditDirective.js");
					$ocLazyLoad.load("modules/company/directives/CompanyListDirective.js");
					$ocLazyLoad.load("modules/company/directives/CompanyListInsurerDirective.js");
					$ocLazyLoad.load("modules/company/directives/CompanyListNotFollowDirective.js");
					$ocLazyLoad.load("modules/company/directives/CompanyListParentDirective.js");

					$ocLazyLoad.load("modules/insurer/directives/InsurerDetail.js")
		
					.then(function(){
						$state.go('loggedIn.company_list');
					})
				}
			}
		})


})