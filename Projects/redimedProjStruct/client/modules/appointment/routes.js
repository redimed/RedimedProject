angular.module('app.loggedIn.appointment', [])

.config(function($stateProvider){
	$stateProvider

	.state('loggedIn.appointment', {
		url: '/appoint',
		resolve: {
			init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
				async.waterfall([
					//Appointment
					function(callback) {
						$ocLazyLoad.load('modules/appointment/extend_routes.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/appointment/controllers/AppointmentController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/appointment/controllers/AppointmentDetailController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/appointment/controllers/AppointmentDoctorController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/appointment/directives/AppointmentCalendarDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/appointment/directives/AppointmentAddDirective.js')
						.then(function() {
							callback(null);
						});
					},
					//end
					// Outreferral
					function(callback) {
						$ocLazyLoad.load('modules/outreferral/directives/OutreferralPatientListDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/outreferral/directives/OutreferralPatientAddDirective.js')
						.then(function() {
							callback(null);
						});
					},
					//end
					//Mdtdoctors
					function(callback) {
						$ocLazyLoad.load('modules/mdtdoctor/extend_routes.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/mdtdoctor/directives/mdtDoctorDetailDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/mdtdoctor/directives/mdtDoctorDirectives.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/mdtdoctor/directives/mdtDoctorSearchDirective.js')
						.then(function() {
							callback(null);
						});
					},
					//end
					function(callback) {
						$ocLazyLoad.load('modules/mdtspecialty/dialogs/mdtSpecialityListByDoctorDialog.js')
						.then(function() {
							callback(null);
						});
					},
					//Mdtoutdoctor
					function(callback) {
						$ocLazyLoad.load('modules/mdtoutdoctor/extend_routes.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/mdtoutdoctor/dialogs/MdtoutdoctorAdddialog.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/mdtoutdoctor/directives/mdtOutdoctorAddDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/mdtoutdoctor/directives/mdtOutdoctorDetailDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/mdtoutdoctor/directives/mdtOutdoctorDirectives.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/mdtoutdoctor/directives/mdtOutdoctorSearchDirective.js')
						.then(function() {
							callback(null);
						});
					},
					//end
					//Claim
					function(callback) {
						$ocLazyLoad.load('modules/claim/extend_routes.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/claim/controllers/ClaimPatientListController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/claim/directives/ClaimPatientListDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/claim/directives/ClaimPatientAddDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/claim/directives/ClaimPatientEditDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/claim/directives/ClaimPatientShowDirective.js')
						.then(function() {
							callback(null);
						});
					},
					//end
					//Patient
					function(callback) {
						$ocLazyLoad.load('modules/patient/directives/PatientSearch.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/patient/directives/PatientWaitingList.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/patient/directives/PatientDirectives.js')
						.then(function() {
							callback(null);
						});
					},
					//end
					//Waiting
					function(callback) {
						$ocLazyLoad.load('modules/waitingList/extend_routes.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {

						$ocLazyLoad.load('modules/waitingList/directives/waitingListListDirective.js')
						.then(function() {
							callback(null);
						})
					},
					function(callback) {
						$ocLazyLoad.load('modules/waitingList/directives/waitingListAddDirective.js')
						.then(function() {
							callback(null);
						});
					},
					//end
					//Template
					function(callback) {
						$ocLazyLoad.load('modules/template/extend_routes.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/controllers/TemplateAddController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/controllers/TemplateEditController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/controllers/TemplateListController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/controllers/TemplatePatientAddController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/controllers/TemplatePatientListController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/controllers/TemplatePatientWriteController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/controllers/TemplateWriteController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/directives/TemplateAddDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/directives/TemplateEditDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/directives/TemplateListDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/directives/TemplatePatientAddDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/directives/TemplatePatientEditDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/directives/TemplatePatientListDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/directives/TemplatePatientWriteDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/template/directives/TemplateWriteDirective.js')
						.then(function() {
							callback(null);
						});
					},
					//end
					//Referral
					function(callback) {
						$ocLazyLoad.load('modules/referral/extend_routes.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/referral/controllers/referralController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/referral/controllers/referralListController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/referral/directives/ReferralDetailDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/referral/directives/ReferralDirectives.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/referral/directives/ReferralSearchDirective.js')
						.then(function() {
							callback(null);
						});
					},
					//end
					//Script
					function(callback) {
						$ocLazyLoad.load('modules/script/controllers/ScriptListController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/script/controllers/ScriptAddController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/script/controllers/ScriptEditController.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/script/directives/ScriptListDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/script/directives/ScriptAddDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$ocLazyLoad.load('modules/script/directives/ScriptEditDirective.js')
						.then(function() {
							callback(null);
						});
					},
					//end
                	//Doctor
					function(callback) {
						$ocLazyLoad.load('modules/doctor/controllers/DoctorPaperlessController.js')
						.then(function() {
							callback(null);
						});
					},
					//Problem
					function(callback) {
						$ocLazyLoad.load('modules/problem/directives/ProblemDirective.js')
						.then(function() {
							callback(null);
						});
					},
					function(callback) {
						$state.go('loggedIn.appointment_list');
					}
				]);
				/*
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

                $ocLazyLoad.load("modules/referral/extend_routes.js");
                $ocLazyLoad.load("modules/referral/controllers/referralController.js");
                $ocLazyLoad.load("modules/referral/controllers/referralListController.js");
                $ocLazyLoad.load("modules/referral/directives/ReferralDetailDirective.js");
                $ocLazyLoad.load("modules/referral/directives/ReferralDirectives.js");
                $ocLazyLoad.load("modules/referral/directives/ReferralSearchDirective.js");

				$ocLazyLoad.load("modules/script/controllers/ScriptListController.js");
				$ocLazyLoad.load("modules/script/controllers/ScriptAddController.js");
				$ocLazyLoad.load("modules/script/controllers/ScriptEditController.js");
				$ocLazyLoad.load("modules/script/directives/ScriptListDirective.js");
				$ocLazyLoad.load("modules/script/directives/ScriptAddDirective.js");
				$ocLazyLoad.load("modules/script/directives/ScriptEditDirective.js")

				$ocLazyLoad.load("modules/doctor/controllers/DoctorPaperlessController.js");

                $ocLazyLoad.load("modules/problem/directives/ProblemDirective.js")
                */
				/*.then(function(){
					
				})*/
			}
		}
	})


})