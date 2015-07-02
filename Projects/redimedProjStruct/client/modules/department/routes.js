angular.module("app.loggedIn.department",[])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.department', {
			url: '/departmentload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
				    async.waterfall([
				    	function(callback) {
   							$ocLazyLoad.load("modules/department/extend_routes.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/department/controllers/DepartmentController.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/department/controllers/DepartmentListController.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/department/directives/DepartmentDetailDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/department/directives/DepartmentDirectives.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/department/directives/DepartmentSearchDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
   							$ocLazyLoad.load("modules/sysservices/directives/SysServicesSearchDirective.js")
						    .then(function() {
						        callback(null);
						    });
						},
						function(callback) {
							$state.go('loggedIn.department_list');
						}
					])
				}
			}
		})

})