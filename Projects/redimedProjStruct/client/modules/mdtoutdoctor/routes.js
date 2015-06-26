angular.module('app.loggedIn.mdtoutdoctor', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.mdtoutdoctor', {
			url: '/mdtoutdoctorload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){

					$ocLazyLoad.load("modules/mdtoutdoctor/extend_routes.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/dialogs/MdtoutdoctorAdddialog.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorAddDirective.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorDetailDirective.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorDirectives.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorSearchDirective.js")

					.then(function(){
						$state.go('loggedIn.mdtoutdoctor_load');
					})
				}
			}
		})


})