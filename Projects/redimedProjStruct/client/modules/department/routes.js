angular.module("app.loggedIn.department",[])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.department', {
			url: '/departmentload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					alert('-12');
					$ocLazyLoad.load("modules/department/extend_routes.js");
					$ocLazyLoad.load("modules/department/controllers/DepartmentController.js");
					$ocLazyLoad.load("modules/department/controllers/DepartmentListController.js");
					$ocLazyLoad.load("modules/department/directives/DepartmentDetailDirective.js");
					$ocLazyLoad.load("modules/department/directives/DepartmentDirectives.js");
					$ocLazyLoad.load("modules/department/directives/DepartmentSearchDirective.js")
					.then(function(){
						$state.go('loggedIn.department_list');
					})
				}
			}
		})

})