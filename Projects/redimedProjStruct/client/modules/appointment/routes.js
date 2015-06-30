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

					$ocLazyLoad.load("modules/template/extend_routes.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateAddController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateEditController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateListController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientAddController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientListController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientWriteController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateWriteController.js");

					$ocLazyLoad.load("modules/template/directives/TemplateAddDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateEditDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateListDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientAddDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientEditDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientListDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientWriteDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateWriteDirective.js");

					$ocLazyLoad.load("modules/template/extend_routes.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateAddController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateEditController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateListController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientAddController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientListController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplatePatientWriteController.js");
					$ocLazyLoad.load("modules/template/controllers/TemplateWriteController.js");

					$ocLazyLoad.load("modules/template/directives/TemplateAddDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateEditDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateListDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientAddDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientEditDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientListDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplatePatientWriteDirective.js");
					$ocLazyLoad.load("modules/template/directives/TemplateWriteDirective.js");
					$ocLazyLoad.load("modules/problem/extend_routes.js");
                    $ocLazyLoad.load("modules/problem/controllers/ProblemController.js");
                    $ocLazyLoad.load("modules/problem/controllers/ProblemListController.js");
                    $ocLazyLoad.load("modules/problem/directives/ProblemDetailDirective.js");
                    $ocLazyLoad.load("modules/problem/directives/ProblemDirective.js")
                    
					.then(function(){
						$state.go('loggedIn.appointment_list');
					})
				}
			}
		})


})