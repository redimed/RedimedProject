angular.module('app.loggedIn.insurer', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.insurer', {
			url: '/insurerload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/insurer/extend_routes.js");
					$ocLazyLoad.load("modules/insurer/controllers/InsurerAddController.js");
					$ocLazyLoad.load("modules/insurer/controllers/InsurerController.js");
					$ocLazyLoad.load("modules/insurer/controllers/InsurerDetailController.js");
					$ocLazyLoad.load("modules/insurer/controllers/InsurerListController.js");

					$ocLazyLoad.load("modules/insurer/directives/InsurerDetail.js");
					$ocLazyLoad.load("modules/insurer/directives/InsurerDirectives.js")
					
					.then(function(){
						$state.go('loggedIn.insurer_list');
					})
				}
			}
		})

})