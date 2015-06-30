angular.module('app.loggedIn.patient', [])

.config(function($stateProvider){
	$stateProvider
		.state("loggedIn.patient", {
	        url: "/patient/:patient_id/:cal_id",
	        templateUrl: "modules/patient/views/structure.html",
	        controller: "PatientController"
	    })
		.state('loggedIn.patient.list', {
			url: '/patientlistload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/patient/extend_routes.js");

					$ocLazyLoad.load("modules/patient/controllers/PatientActionController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientAddController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientAppointmentController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientApptDocController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientApptListController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientBookingController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientCheckinController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientCompaniesController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientDetailController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientDetailMasterController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientHomeController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientInvoiceDetailController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientInvoicesController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientItemSheetController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientListAllController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientListController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientOutsideReferralsController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientRecallController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientReferralsController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientSearchController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientWorkcoverController.js");


					$ocLazyLoad.load("modules/patient/directives/ngThumb.js");
					$ocLazyLoad.load("modules/patient/directives/PatientClaim.js");
					$ocLazyLoad.load("modules/patient/directives/PatientCompanies.js");
					$ocLazyLoad.load("modules/patient/directives/PatientDetail.js")
					$ocLazyLoad.load("modules/patient/directives/PatientDirectives.js");
					$ocLazyLoad.load("modules/patient/directives/PatientOutsideReferral.js");
					$ocLazyLoad.load("modules/patient/directives/PatientSearch.js");
					$ocLazyLoad.load("modules/patient/directives/PatientWaitingList.js");
					$ocLazyLoad.load("modules/patient/directives/PatientSearchByCompany.js")
					.then(function(){
						$state.go('loggedIn.patient_list');
					})
				}
			}
		})
		.state('loggedIn.listall', {
			url: '/patientallload',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/patient/extend_routes.js");

					$ocLazyLoad.load("modules/patient/controllers/PatientActionController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientAddController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientAppointmentController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientApptDocController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientApptListController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientBookingController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientCheckinController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientCompaniesController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientDetailController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientDetailMasterController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientHomeController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientInvoiceDetailController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientInvoicesController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientItemSheetController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientListAllController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientListController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientOutsideReferralsController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientRecallController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientReferralsController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientSearchController.js");
					$ocLazyLoad.load("modules/patient/controllers/PatientWorkcoverController.js");


					$ocLazyLoad.load("modules/patient/directives/ngThumb.js");
					$ocLazyLoad.load("modules/patient/directives/PatientClaim.js");
					$ocLazyLoad.load("modules/patient/directives/PatientCompanies.js");
					$ocLazyLoad.load("modules/patient/directives/PatientDetail.js")
					$ocLazyLoad.load("modules/patient/directives/PatientDirectives.js");
					$ocLazyLoad.load("modules/patient/directives/PatientOutsideReferral.js");
					$ocLazyLoad.load("modules/patient/directives/PatientSearch.js");
					$ocLazyLoad.load("modules/patient/directives/PatientWaitingList.js");
					$ocLazyLoad.load("modules/patient/directives/PatientSearchByCompany.js")

					$ocLazyLoad.load("modules/company/directives/CompanyAddNotFollowDirective.js");
					$ocLazyLoad.load("modules/company/directives/CompanyListNotFollowDirective.js")
					.then(function(){
						$state.go('loggedIn.listall_list');
					})
				}
			}
		})
})