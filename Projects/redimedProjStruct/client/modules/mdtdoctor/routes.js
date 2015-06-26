angular.module('app.loggedIn.mdtdoctor', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.mdtdoctor', {
			url: '/mdtoutdoctorload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){

					$ocLazyLoad.load("modules/mdtdoctor/extend_routes.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDetailDirective.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDirectives.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorSearchDirective.js");
					$ocLazyLoad.load("modules/mdtspecialty/dialogs/mdtSpecialityListByDoctorDialog.js")
					
					.then(function(){
						$state.go('loggedIn.mdtoutdoctor_load');
					})
				}
			}
		})


})