angular.module('app.loggedIn.company', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.patient.company', {
			url: '/companyload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
				async.waterfall([
					function(callback) {
   						$ocLazyLoad.load("modules/company/extend_routes.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/models/CompanyModel.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/services/CompanyServices.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/controllers/CompanyAddController.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/controllers/CompanyEditController.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/controllers/CompanyListController.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/controllers/CompanyListInsurerController.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/controllers/CompanyListNotFollowController.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/controllers/CompanyListParentController.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/dialogs/CompanyAddNewInsurerDialgosController.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/dialogs/CompanyAddParentDialgosController.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/dialogs/CompanyInsurerDialgosController.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/dialogs/CompanyListNoFollowDialog.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/dialogs/CompanyListNoFollowDialog.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/dialogs/CompanyRemoveDialog.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/directives/CompanyAddDirective.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/directives/CompanyAddNotFollowDirective.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/directives/CompanyEditDirective.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/directives/CompanyListDirective.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/directives/CompanyListInsurerDirective.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/directives/CompanyListNotFollowDirective.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/company/directives/CompanyListParentDirective.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/invoice/directives/InvoiceDetailDirective.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
   						$ocLazyLoad.load("modules/insurer/directives/InsurerDetail.js")
					    .then(function() {
					        callback(null);
					    });
					},
					function(callback) {
						$state.go('loggedIn.patient.company_list');
					}
				]);
				}
			}
		})


})