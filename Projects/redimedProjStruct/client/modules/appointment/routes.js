angular.module('app.loggedIn.appointment', [])

.config(function($stateProvider){
	$stateProvider

		.state('loggedIn.appointment', {
			url: '/appoint',
			resolve: {
				init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
					$ocLazyLoad.load("modules/appointment/extend_routes.js");
					$ocLazyLoad.load("modules/appointment/controllers/AppointmentController.js");
					$ocLazyLoad.load("modules/appointment/controllers/AppointmentDetailController.js");
					$ocLazyLoad.load("modules/appointment/controllers/AppointmentDoctorController.js");
					$ocLazyLoad.load("modules/appointment/directives/AppointmentCalendarDirective.js");
					$ocLazyLoad.load("modules/appointment/directives/AppointmentAddDirective.js");
					
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientListDirective.js");
					$ocLazyLoad.load("modules/outreferral/directives/OutreferralPatientAddDirective.js");
					
					$ocLazyLoad.load("modules/mdtdoctor/extend_routes.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDetailDirective.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorDirectives.js");
					$ocLazyLoad.load("modules/mdtdoctor/directives/mdtDoctorSearchDirective.js");
					$ocLazyLoad.load("modules/mdtspecialty/dialogs/mdtSpecialityListByDoctorDialog.js")
					$ocLazyLoad.load("modules/mdtoutdoctor/extend_routes.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/dialogs/MdtoutdoctorAdddialog.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorAddDirective.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorDetailDirective.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorDirectives.js");
					$ocLazyLoad.load("modules/mdtoutdoctor/directives/mdtOutdoctorSearchDirective.js")

					$ocLazyLoad.load("modules/claim/directives/ClaimPatientAddDirective.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientEditDirective.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientListDirective.js");
					$ocLazyLoad.load("modules/claim/directives/ClaimPatientShowDirective.js")

					$ocLazyLoad.load("modules/patient/directives/PatientSearch.js");
					$ocLazyLoad.load("modules/patient/directives/PatientWaitingList.js");
					$ocLazyLoad.load("modules/waitingList/directives/waitingListAddDirective.js");
					$ocLazyLoad.load("modules/patient/directives/PatientDirectives.js");
					$ocLazyLoad.load("modules/patient/directives/PatientDetail.js");

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
						$state.go('loggedIn.appointment_list');
					})
				}
			}
		})


})