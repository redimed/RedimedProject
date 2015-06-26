angular.module('app.loggedIn.outreferral',[])

.config(function($stateProvider){
	$stateProvider
		.state('loggedIn.outreferral', {
			url: '/outreferralload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){

					$ocLazyLoad.load("modules/outreferral/extend_routes.js");
					$ocLazyLoad.load("modules/outreferral/controllers/OutreferralPatientListController.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientAddDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientEditDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientListDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientShowDirective.js");

					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorSearchDirective.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorSearchDirective.js")
					
					.then(function(){
						$state.go('loggedIn.outreferral_list');
					})
				}
			}
		})


})