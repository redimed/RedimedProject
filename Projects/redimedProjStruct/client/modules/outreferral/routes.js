angular.module('app.loggedIn.outreferral',[])

.config(function($stateProvider){
	$stateProvider
		.state('loggedIn.patient.outreferral', {
			url: '/outreferralload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/outreferral/extend_routes.js");
					$ocLazyLoad.load("modules/outreferral/controllers/OutreferralPatientListController.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientAddDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientEditDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientListDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientShowDirective.js");

					$ocLazyLoad.load("modules/mdtoutdoctor/extend_routes.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/dialogs/MdtoutdoctorAdddialog.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorAddDirective.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorDetailDirective.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorDirectives.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorSearchDirective.js");
					
					$ocLazyLoad.load("modules/mdtdoctor/extend_routes.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDetailDirective.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDirectives.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorSearchDirective.js");
					$ocLazyLoad.load("modules/mdtspecialty/dialogs/mdtSpecialityListByDoctorDialog.js")
					
					.then(function(){
						$state.go('loggedIn.patient.outreferral_list');
					})
				}
			}
		})


})