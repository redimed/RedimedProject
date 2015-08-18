var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('common', function(){
	return gulp.src(['./client/vendor/jquery/dist/jquery.js', 
					'./client/vendor/jquery-ui/ui/jquery-ui.js', 
					'./client/lib/jquery.ui.touch-punch.js', 
					'./client/theme/assets/global/plugins/bootstrap/js/bootstrap.min.js',
					'./client/lib/wysiwyg.js/src/wysiwyg.js',
					'./client/lib/wysiwyg.js/src/wysiwyg-editor.js',
					'./client/vendor/angular/angular.js',
					'./client/vendor/angular-bindonce/bindonce.js',
					'./client/theme/assets/global/plugins/moment.min.js',
					'./client/vendor/moment-range/lib/moment-range.js',
					'./client/lib/dateRangePicker/angular-date-range-picker.js',
					'./client/lib/ng-map.min.js',
					'./client/theme/assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
					'./client/lib/angular-sanitize.min.js',
					'./client/lib/modernizr-2.6.2.min.js',
					'./client/theme/assets/global/plugins/angular/angular-resource.min.js',
					'./client/theme/assets/global/plugins/angular/angular-route.min.js',
					'./client/theme/assets/global/plugins/angular/angular-cookies.min.js',
					'./client/theme/assets/global/plugins/angular/angular-filter.min.js',
					'./client/theme/assets/global/plugins/angular/angular-file-upload.min.js',
					'./client/theme/assets/global/plugins/angular/angular-mailto.js',
					'./client/vendor/angular-bootstrap/ui-bootstrap.min.js',
					'./client/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
					'./client/vendor/angular-ui-router/release/angular-ui-router.min.js',
					'./client/vendor/jquery-minicolors/jquery.minicolors.min.js',
					'./client/lib/jquery-knob/js/jquery.knob.js',
					'./client/vendor/lodash/dist/lodash.compat.min.js',
					'./client/vendor/restangular/dist/restangular.min.js',
					'./client/lib/timepicker/include/ui-1.10.0/jquery.ui.core.min.js',
					'./client/lib/timepicker/include/ui-1.10.0/jquery.ui.widget.min.js',
					'./client/lib/timepicker/include/ui-1.10.0/jquery.ui.tabs.min.js',
					'./client/lib/timepicker/include/ui-1.10.0/jquery.ui.position.min.js',
					'./client/lib/timepicker/jquery.ui.timepicker.js',
					'./client/vendor/angular-cookies/angular-cookies.min.js',
					'./client/lib/angular-local-storage.min.js',
					'./client/vendor/angular-fcsa-number/src/fcsaNumber.min.js',
					'./client/vendor/angular-loading-bar/build/loading-bar.min.js',
					'./client/vendor/angular-translate/angular-translate.min.js',
					'./client/vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
					'./client/lib/desktop-notify.js',
					'./client/lib/EasyRTC/opentok.min.js',
					'./client/lib/EasyRTC/OTChromeScreenSharingExtensionHelper.js',
					'./client/vendor/opentok-layout-js/opentok-layout.js',
					'./client/vendor/opentok-angular/opentok-angular.js',
					'./client/vendor/angularjs-scroll-glue/src/scrollglue.js',
					'./client/vendor/angular-bootstrap-simple-chat/src/scripts/index.js',
					'./client/lib/flot/jquery.flot.min.js',
					'./client/lib/flot/jquery.flot.resize.min.js',
					'./client/jquery.flot.categories.min.js',
					'./client/vendor/angular-svg-round-progressbar/build/roundProgress.js',
					'./client/vendor/angular-flot/angular-flot.js',
					'./client/vendor/angular-ui-select/dist/select.js',
					'./client/vendor/chosen/chosen.jquery.min.js',
					'./client/vendor/angular-chosen-localytics/chosen.js',
					'./client/vendor/angular-touch/angular-touch.min.js',
					'./client/vendor/angular-ui-slider/src/slider.js',
					'./client/vendor/angular-hotkeys/build/hotkeys.min.js',
					'./client/vendor/angular-toastr/dist/angular-toastr.min.js',
					'./client/vendor/ng-table/ng-table.min.js',
					'./client/vendor/angular-file-upload/angular-file-upload.min.js',
					'./client/vendor/jasny-bootstrap/dist/js/jasny-bootstrap.min.js',
					'./client/vendor/ng-idle/angular-idle.min.js',
					'./client/lib/socket.io-1.3.5.js',
					'./client/theme/assets/global/plugins/jquery-migrate-1.2.1.min.js',
					'./client/vendor/angular-ui-date/src/date.js',
					'./client/theme/assets/global/plugins/jSignature/jSignature.min.js',
					'./client/theme/assets/global/plugins/jSignature/jSignature.min.noconflict.js',
					'./client/vendor/angular-xeditable/dist/js/xeditable.js',
					'./client/theme/assets/global/plugins/bootstrap/js/bootstrap.min.js',
					'./client/theme/assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
					'./client/theme/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js',
					'./client/theme/assets/global/plugins/jquery.blockui.min.js',
					'./client/theme/assets/global/plugins/uniform/jquery.uniform.min.js',
					'./client/theme/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
					'./client/theme/assets/global/plugins/select2/select2.min.js',
					'./client/theme/assets/global/plugins/datatables/media/js/jquery.dataTables.min.js',
					'./client/theme/assets/global/plugins/datatables/media/js/jquery.dataTables.columnFilter.js',
					'./client/theme/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js',
					'./client/theme/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
					'./client/theme/assets/global/plugins/bootstrap-datepaginator/bootstrap-datepaginator.min.js',
					'./client/theme/assets/admin/pages/scripts/ui-datepaginator.js',
					'./client/theme/assets/global/plugins/datatables/media/js/jquery.dataTables.min.js',
					'./client/theme/assets/global/plugins/datatables/media/js/jquery.dataTables.columnFilter.js',
					'./client/theme/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js',
					'./client/theme/assets/global/plugins/bootstrap-notify/js/bootstrap-notify.js',
					'./client/lib/dropzone.js',
					'./client/vendor/ng-draggable/ngDraggable.js',
					'./client/vendor/angular-dragdrop/src/angular-dragdrop.min.js',
					'./client/common/directives/common.js', 
					'./client/common/directives/mydatatable.js',
					'./client/common/directives/smartfloat.js',
	])
	.pipe(concat('common.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('home', function(){
	return gulp.src(['./client/modules/home/Home.js', 
					'./client/modules/home/controllers/HomeController.js', 
	])
	.pipe(concat('home.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('appointment', function(){
	return gulp.src(['./client/modules/appointment/routes.js', 
					'./client/modules/appointment/include.js',
					'./client/modules/appointment/models/AppointmentModel.js',
					'./client/modules/appointment/controllers/AppointmentController.js',
					'./client/modules/appointment/controllers/AppointmentDetailController.js',
					'./client/modules/appointment/controllers/AppointmentDoctorController.js',
					'./client/modules/appointment/directives/AppointmentCalendarDirective.js',
					'./client/modules/appointment/directives/AppointmentAddDirective.js',
	])
	.pipe(concat('appointment.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('alert', function(){
	return gulp.src(['./client/modules/alert/routes.js', 
					 './client/modules/alert/include.js',
					 './client/modules/alert/models/AlertModel.js',
					 './client/modules/alert/controllers/AlertListController.js',
					 './client/modules/alert/controllers/AlertPatientListController.js',
					 './client/modules/alert/directives/AlertListDirective.js',
					 './client/modules/alert/directives/AlertPatientListDirective.js',
					 './client/modules/alert/directives/AlertAddDirective.js',
					 './client/modules/alert/directives/AlertEditDirective.js'

	])
	.pipe(concat('alert.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('allergies', function(){
	return gulp.src(['./client/modules/allergies/Allergy.js', 
					 './client/modules/allergies/controllers/AllergyController.js',
					 './client/modules/allergies/controllers/AllergyListController.js',
					 './client/modules/allergies/services/AllergyService.js',
					 './client/modules/allergies/directives/AllergyDirective.js',
					 './client/modules/allergies/directives/AllergyDetailDirective.js',
	])
	.pipe(concat('allergies.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('certificate', function(){
	return gulp.src(['./client/modules/certificate/Certificate.js', 
					 './client/modules/certificate/controllers/CertificateController.js',
					 './client/modules/certificate/controllers/CertificateHomeController.js',
					 './client/modules/certificate/controllers/CertificateReferralController.js',
					 './client/modules/certificate/controllers/CertificateScriptsController.js',
					 './client/modules/certificate/directives/CertificateDirective.js',
					 './client/modules/certificate/directives/ScriptDirective.js',
	])
	.pipe(concat('certificate.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('claim', function(){
	return gulp.src(['./client/modules/claim/routes.js', 
					 './client/modules/claim/include.js',
					 './client/modules/claim/models/ClaimModel.js',
					 './client/modules/claim/directives/ClaimPatientAddDirective.js',
					 './client/modules/claim/directives/ClaimPatientEditDirective.js',
					 './client/modules/claim/directives/ClaimPatientListDirective.js',
					 './client/modules/claim/directives/ClaimPatientShowDirective.js',
					 './client/modules/claim/controllers/ClaimPatientListController.js',
	])
	.pipe(concat('claim.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('company', function(){
	return gulp.src(['./client/modules/company/routes.js', 
					 './client/modules/company/include.js',
					 './client/modules/company/models/CompanyModel.js',
					 './client/modules/company/services/CompanyServices.js',
					 './client/modules/company/directives/CompanyListDirective.js',
					 './client/modules/company/controllers/CompanyListController.js',
					 './client/modules/company/directives/CompanyListParentDirective.js',
					 './client/modules/company/controllers/CompanyListParentController.js',
					 './client/modules/company/directives/CompanyListInsurerDirective.js',
					 './client/modules/company/controllers/CompanyListInsurerController.js',
					 './client/modules/company/directives/CompanyAddNotFollowDirective.js',
					 './client/modules/company/directives/CompanyAddDirective.js',
					 './client/modules/company/controllers/CompanyAddController.js',
					 './client/modules/company/directives/CompanyEditDirective.js',
					 './client/modules/company/controllers/CompanyEditController.js',
					 './client/modules/company/directives/CompanyListNotFollowDirective.js',
					 './client/modules/company/controllers/CompanyListNotFollowController.js',
					 './client/modules/company/dialogs/CompanyAddParentDialgosController.js',
					 './client/modules/company/dialogs/CompanyAddNewInsurerDialgosController.js',
					 './client/modules/company/dialogs/CompanyInsurerDialgosController.js',
					 './client/modules/company/dialogs/CompanyListNoFollowDialog.js',
					 './client/modules/company/dialogs/CompanyRemoveDialog.js',
					
	])
	.pipe(concat('company.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('consultation', function(){
	return gulp.src(['./client/modules/consultation/directives/ExerciseDirectives.js', 
					 './client/modules/consultation/directives/ConsultationDirectives.js',
					 './client/modules/consultation/services/ConsultationService.js',
					 './client/modules/consultation/controllers/PatientConsultItemsheetController.js',
					 './client/modules/consultation/controllers/ScriptController.js',
					 './client/modules/consultation/controllers/MeasurementController.js',
					 './client/modules/consultation/controllers/ConsultHistoryController.js',
					 './client/modules/consultation/controllers/PatientConsultController.js',
					 './client/modules/consultation/controllers/CorrespondenceController.js',
					 './client/modules/consultation/directives/CorrespondenceDirectives.js',
					 './client/modules/consultation/controllers/CorrespondenceAddController.js',
					 './client/modules/consultation/directives/CorrespondenceAddDirectives.js',
					 './client/modules/consultation/controllers/CorrespondenceEditController.js',
					 './client/modules/consultation/directives/CorrespondenceEditDirectives.js',
					 './client/modules/consultation/consultation.js'
					
	])
	.pipe(concat('consultation.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('department', function(){
	return gulp.src(['./client/modules/department/Department.js', 
					 './client/modules/department/services/DepartmentServices.js',
					 './client/modules/department/directives/DepartmentDirectives.js',
					 './client/modules/department/directives/DepartmentDetailDirective.js',
					 './client/modules/department/directives/DepartmentSearchDirective.js',
					 './client/modules/department/controllers/DepartmentController.js',
					 './client/modules/department/controllers/DepartmentListController.js'
					
	])
	.pipe(concat('department.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('doctor', function(){
	return gulp.src(['./client/modules/doctor/Doctor.js', 
					 './client/modules/doctor/services/DoctorServices.js',
					 './client/modules/doctor/controllers/DoctorController.js',
					 './client/modules/doctor/controllers/DoctorHomeController.js',
					 './client/modules/doctor/controllers/DoctorListController.js',
					 './client/modules/doctor/controllers/DoctorSettingController.js',
					 './client/modules/doctor/controllers/DoctorAddController.js',
					 './client/modules/doctor/controllers/DoctorTimetableController.js',
					 './client/modules/doctor/controllers/DoctorTimetableDetailController.js',
					 './client/modules/doctor/controllers/DoctorTimetableDetailCalendarController.js',
					 './client/modules/doctor/controllers/DoctorTimetableDetailProfileController.js',
					 './client/modules/doctor/controllers/DoctorTimetableDetailLeaveController.js',
					 './client/modules/doctor/controllers/DoctorPaperlessController.js',
					 './client/modules/doctor/controllers/DoctorTimetableDetailCasualController.js',
					 './client/modules/doctor/controllers/DoctorPatientsController.js',
					 './client/modules/doctor/controllers/DoctorPatientsDetailController.js',
					 './client/modules/doctor/controllers/DoctorPatientsDetailApptController.js',
					 './client/modules/doctor/controllers/DoctorPatientsDetailApptMoreController.js',
					 './client/modules/doctor/controllers/DoctorItemsController.js',
					 './client/modules/doctor/controllers/DoctorItemsAddController.js',
					 './client/modules/doctor/controllers/DoctorItemsEditController.js',
					 './client/modules/doctor/controllers/DoctorItemsCatController.js',
					 './client/modules/doctor/controllers/FaChooseController.js',
					 './client/modules/doctor/directives/DoctorDirective.js',
					 './client/modules/doctor/directives/DoctorSearch.js',
					 './client/modules/doctor/directives/DoctorList.js',
					 './client/modules/doctor/directives/ItemSearch.js',
					
	])
	.pipe(concat('doctor.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('document', function(){
	return gulp.src(['./client/modules/document/document.js', 
					 './client/modules/document/services/DocumentService.js',
					 './client/modules/document/controllers/Cat2Controller.js',
					 './client/modules/document/controllers/Cat3Controller.js',
					 './client/modules/document/controllers/FAController.js',
					 './client/modules/document/controllers/MAController.js',
					 './client/modules/document/controllers/IDSController.js',
					 './client/modules/document/controllers/MHController.js',
					 './client/modules/document/controllers/MRSController.js',
					 './client/modules/document/controllers/SA1Controller.js',
					 './client/modules/document/controllers/SA2Controller.js',
					 './client/modules/document/controllers/form18Controller.js',
					 './client/modules/document/controllers/gorgonFAController.js',
					 './client/modules/document/controllers/gorgonMAController.js',
					 './client/modules/document/controllers/gorgonMHController.js',
					 './client/modules/document/controllers/gorgonUQController.js',
					 './client/modules/document/controllers/demoController.js',
					 './client/modules/document/controllers/detailController.js',
					 './client/modules/document/controllers/addPatientController.js',
					 './client/modules/document/controllers/COEController.js',
					 './client/modules/document/controllers/newFAController.js',
					 './client/modules/document/controllers/PEMedicalController.js',
					 './client/modules/document/controllers/CSController.js',
					 './client/modules/document/controllers/FleetController.js',
					 './client/modules/document/controllers/GroundSupportController.js',
					 './client/modules/document/controllers/RampBaggageController.js'
	])
	.pipe(concat('document.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('fadefine', function(){
	return gulp.src(['./client/modules/fadefine/fadefine.js', 
					 './client/modules/fadefine/controllers/fadefineController.js',
					 './client/modules/fadefine/controllers/fadefineListController.js',
					 './client/modules/fadefine/controllers/fadefineDetailController.js',
					 './client/modules/fadefine/controllers/imageDialogController.js',
					 './client/modules/fadefine/services/fadefineService.js',
	])
	.pipe(concat('fadefine.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('function', function(){
	return gulp.src(['./client/modules/function/Function.js', 
					 './client/modules/function/services/FunctionService.js',
					 './client/modules/function/controllers/FunctionController.js',
	])
	.pipe(concat('function.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('hrPayroll', function(){
	return gulp.src(['./client/modules/hrPayroll/libs/pr_helper.js', 
					 './client/modules/hrPayroll/pr.js',
					 './client/modules/hrPayroll/controllers/prController.js',
					 './client/modules/hrPayroll/directives/prDirective.js',
					 './client/modules/hrPayroll/directives/prImportTaxList.js',
					 './client/modules/hrPayroll/services/prService.js',
					 './client/modules/hrPayroll/controllers/prTaxListController.js',
	])
	.pipe(concat('hrPayroll.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('injuryManagement', function(){
	return gulp.src(['./client/modules/injuryManagement/InjuryManagement.js', 
					 './client/modules/injuryManagement/controllers/InjuryMapController.js',
					 './client/modules/injuryManagement/controllers/InjuryListController.js',
					 './client/modules/injuryManagement/controllers/InjuryDetailController.js',
					 './client/modules/injuryManagement/controllers/BluetoothController.js',
					 './client/modules/injuryManagement/services/InjuryManagementService.js',
	])
	.pipe(concat('injuryManagement.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('insurer', function(){
	return gulp.src(['./client/modules/insurer/Insurer.js', 
					 './client/modules/insurer/services/InsurerServices.js',
					 './client/modules/insurer/directives/InsurerDirectives.js',
					 './client/modules/insurer/directives/InsurerDetail.js',
					 './client/modules/insurer/controllers/InsurerController.js',
					 './client/modules/insurer/controllers/InsurerListController.js',
					 './client/modules/insurer/controllers/InsurerDetailController.js',
					 './client/modules/insurer/controllers/InsurerAddController.js',
					
	])
	.pipe(concat('insurer.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('invoice', function(){
	return gulp.src(['./client/modules/invoice/js/invoice_helper.js', 
					 './client/modules/invoice/Invoice.js', 
					 './client/modules/invoice/services/InvoiceServices.js',
					 './client/modules/invoice/controllers/InvoiceController.js',
					 './client/modules/invoice/controllers/InvoiceListController.js',
					 './client/modules/invoice/directives/InvoiceDirectives.js',
					 './client/modules/invoice/directives/InvoiceDetailDirective.js',
					 './client/modules/invoice/directives/tnInvoiceDetailDirective.js',
					 './client/modules/invoice/directives/InvoiceSearchDirective.js',
					 './client/modules/invoice/directives/InvoiceAddDirective.js',
					 './client/modules/invoice/directives/ManualInvoiceAddDirective.js',
	])
	.pipe(concat('invoice.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('iso', function(){
	return gulp.src(['./client/modules/iso/iso.js', 
					 './client/modules/iso/controllers/isoController.js',
					 './client/modules/iso/controllers/isoMainController.js',
					 './client/modules/iso/directives/isoDirective.js',
					 './client/modules/iso/directives/isoSelectionUserName.js',
					 './client/modules/iso/directives/isoSelectionGroupUser.js',
					 './client/modules/iso/directives/isoGrantUserPermission.js',
					 './client/modules/iso/js/iso_helper.js',
					 './client/modules/iso/js/iso_objects.js',
					 './client/modules/iso/js/iso_actions.js',
					 './client/modules/iso/controllers/isoSubmitStatusPendingController.js',
					 './client/modules/iso/controllers/isoHierarchyApprovalController.js',
					 './client/modules/iso/controllers/isoUserGroupController.js',
					 './client/modules/iso/controllers/isoApproverListController.js',
					 './client/modules/iso/controllers/isoAdminListController.js',
					 './client/modules/iso/services/isoService.js',
					
	])
	.pipe(concat('iso.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('item', function(){
	return gulp.src(['./client/modules/item/js/item_helper.js', 
		    		 './client/modules/item/Item.js', 
					 './client/modules/item/services/ItemServices.js',
					 './client/modules/item/directives/ItemDirectives.js',
					 './client/modules/item/directives/ItemDetailDirective.js',
					 './client/modules/item/directives/ItemSearchDirective.js',
					 './client/modules/item/directives/ItemFeesDirective.js',
					 './client/modules/item/directives/ItemHeaderDetailDirective.js',
					 './client/modules/item/directives/ItemFeeGroupDetailDirective.js',
					 './client/modules/item/directives/ItemFeeTypeDirective.js',
					 './client/modules/item/directives/ItemShowHistoryDirective.js',
					 './client/modules/item/directives/ItemPrivateFundsDirective.js',
					 './client/modules/item/controllers/ItemController.js',
					 './client/modules/item/controllers/ItemListController.js',
					 './client/modules/item/controllers/ItemHeaderController.js',
					 './client/modules/item/controllers/ItemFeeController.js',
					 './client/modules/item/controllers/ItemFeeSearchController.js',
	])
	.pipe(concat('item.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('kissModule', function(){
	return gulp.src(['./client/modules/kissModule/js/kiss.js', 
					 './client/modules/kissModule/directives/kissTimerDirective.js',
	])
	.pipe(concat('kissModule.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('makeCall', function(){
	return gulp.src(['./client/modules/makeCall/routes.js', 
					 './client/modules/makeCall/controllers/callController.js',
					 './client/modules/makeCall/controllers/callController_apiRTC.js',
					
	])
	.pipe(concat('makeCall.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtappointment', function(){
	return gulp.src(['./client/modules/mdtappointment/mdtAppointment.js', 
					 './client/modules/mdtappointment/services/mdtAppointmentServices.js',
					 './client/modules/mdtappointment/directives/mdtAppointmentDirectives.js',
					 './client/modules/mdtappointment/directives/mdtAppointmentDetailDirective.js',
					 './client/modules/mdtappointment/directives/mdtAppointmentSearchDirective.js',
	])
	.pipe(concat('mdtappointment.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtdept', function(){
	return gulp.src(['./client/modules/mdtdept/mdtDept.js', 
					 './client/modules/mdtdept/services/mdtDeptServices.js',
					 './client/modules/mdtdept/directives/mdtDeptDirectives.js',
					 './client/modules/mdtdept/directives/mdtDeptDetailDirective.js',
					 './client/modules/mdtdept/directives/mdtDeptSearchDirective.js',
					
	])
	.pipe(concat('mdtdept.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtdoctor', function(){
	return gulp.src(['./client/modules/mdtdoctor/mdtDoctor.js', 
					 './client/modules/mdtdoctor/services/mdtDoctorServices.js',
					 './client/modules/mdtdoctor/directives/mdtDoctorDirectives.js',
					 './client/modules/mdtdoctor/directives/mdtDoctorDetailDirective.js',
					 './client/modules/mdtdoctor/directives/mdtDoctorSearchDirective.js',
					
	])
	.pipe(concat('mdtdoctor.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtinsurer', function(){
	return gulp.src(['./client/modules/mdtinsurer/mdtInsurer.js', 
					 './client/modules/mdtinsurer/services/mdtInsurerServices.js',
					 './client/modules/mdtinsurer/directives/mdtInsurerDirectives.js',
					 './client/modules/mdtinsurer/directives/mdtInsurerDetailDirective.js',
					 './client/modules/mdtinsurer/directives/mdtInsurerSearchDirective.js',
	])
	.pipe(concat('mdtinsurer.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtoutdoctor', function(){
	return gulp.src(['./client/modules/mdtoutdoctor/mdtOutdoctor.js', 
					 './client/modules/mdtoutdoctor/services/mdtOutdoctorServices.js',
					 './client/modules/mdtoutdoctor/directives/mdtOutdoctorDirectives.js',
					 './client/modules/mdtoutdoctor/directives/mdtOutdoctorDetailDirective.js',
					 './client/modules/mdtoutdoctor/directives/mdtOutdoctorSearchDirective.js',
					 './client/modules/mdtoutdoctor/directives/mdtOutdoctorAddDirective.js',
					 './client/modules/mdtoutdoctor/dialogs/MdtoutdoctorAdddialog.js',
	])
	.pipe(concat('mdtoutdoctor.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtoutreferral', function(){
	return gulp.src(['./client/modules/mdtoutreferral/mdtoutreferral.js', 
					 './client/modules/mdtoutreferral/services/mdtoutreferralServices.js',
					 './client/modules/mdtoutreferral/directives/mdtoutreferralDirectives.js',
					 './client/modules/mdtoutreferral/directives/mdtoutreferralDetailDirective.js',
					 './client/modules/mdtoutreferral/directives/mdtoutreferralSearchDirective.js',
					
	])
	.pipe(concat('mdtoutreferral.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtprovider', function(){
	return gulp.src(['./client/modules/mdtprovider/mdtProvider.js', 
					 './client/modules/mdtprovider/services/mdtProviderServices.js',
					 './client/modules/mdtprovider/directives/mdtProviderDirectives.js',
					 './client/modules/mdtprovider/directives/mdtProviderDetailDirective.js',
					 './client/modules/mdtprovider/directives/mdtProviderSearchDirective.js',
	])
	.pipe(concat('mdtprovider.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtrecall', function(){
	return gulp.src(['./client/modules/mdtrecall/mdtRecall.js', 
					 './client/modules/mdtrecall/services/mdtRecallServices.js',
					 './client/modules/mdtrecall/directives/mdtRecallDirectives.js',
					 './client/modules/mdtrecall/directives/mdtRecallDetailDirective.js',
					 './client/modules/mdtrecall/directives/mdtRecallSearchDirective.js',
					
	])
	.pipe(concat('mdtrecall.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtredimedsites', function(){
	return gulp.src(['./client/modules/mdtredimedsites/mdtRedimedsites.js', 
					 './client/modules/mdtredimedsites/services/mdtRedimedsitesServices.js',
					 './client/modules/mdtredimedsites/directives/mdtRedimedsitesDirectives.js',
					 './client/modules/mdtredimedsites/directives/mdtRedimedsitesDetailDirective.js',
					 './client/modules/mdtredimedsites/directives/mdtRedimedsitesSearchDirective.js',
					
	])
	.pipe(concat('mdtredimedsites.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdtspecialty', function(){
	return gulp.src(['./client/modules/mdtspecialty/mdtSpecialty.js', 
					 './client/modules/mdtspecialty/services/mdtSpecialtyServices.js',
					 './client/modules/mdtspecialty/directives/mdtSpecialtyDirectives.js',
					 './client/modules/mdtspecialty/directives/mdtSpecialtyDetailDirective.js',
					 './client/modules/mdtspecialty/directives/mdtSpecialtySearchDirective.js',
					 './client/modules/mdtspecialty/directives/mdtSpecialtySearchByDoctorDirective.js',
					 './client/modules/mdtspecialty/dialogs/mdtSpecialityListByDoctorDialog.js',
	])
	.pipe(concat('mdtspecialty.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('mdttimetable', function(){
	return gulp.src(['./client/modules/mdttimetable/mdtTimetable.js', 
					 './client/modules/mdttimetable/services/mdtTimetableServices.js',
					 './client/modules/mdttimetable/directives/mdtTimetableDirectives.js',
					 './client/modules/mdttimetable/directives/mdtTimetableMainDirective.js',
					
	])
	.pipe(concat('mdttimetable.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('medicine', function(){
	return gulp.src(['./client/modules/medicine/Medicine.js', 
					 './client/modules/medicine/controllers/MedicineController.js',
					 './client/modules/medicine/controllers/MedicineListController.js',
					 './client/modules/medicine/services/MedicineService.js',
					 './client/modules/medicine/directives/MedicineDirective.js',
					 './client/modules/medicine/directives/MedicineDetailDirective.js',
					
	])
	.pipe(concat('medicine.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('menu', function(){
	return gulp.src(['./client/modules/menu/Menu.js', 
					 './client/modules/menu/services/MenuService.js',
					 './client/modules/menu/controllers/MenuController.js',
	])
	.pipe(concat('menu.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('onlineBooking', function(){
	return gulp.src(['./client/modules/onlineBooking/OnlineBooking.js', 
					 './client/modules/onlineBooking/controllers/MakeBookingController.js',
					 './client/modules/onlineBooking/controllers/BookingListController.js',
					 './client/modules/onlineBooking/controllers/PackageController.js',
					 './client/modules/onlineBooking/controllers/PositionController.js',
					 './client/modules/onlineBooking/controllers/SettingController.js',
					 './client/modules/onlineBooking/services/OnlineBookingService.js',
	])
	.pipe(concat('onlineBooking.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('onlineBooking_Admin', function(){
	return gulp.src(['./client/modules/onlineBooking_Admin/OnlineBookingAdmin.js', 
					 './client/modules/onlineBooking_Admin/controllers/BookingController.js',
					 './client/modules/onlineBooking_Admin/controllers/AssessmentController.js',
					 './client/modules/onlineBooking_Admin/controllers/CompanyController.js',
					 './client/modules/onlineBooking_Admin/controllers/UserController.js',
					 './client/modules/onlineBooking_Admin/controllers/SiteController.js',
					 './client/modules/onlineBooking_Admin/controllers/RequirementController.js',
					 './client/modules/onlineBooking_Admin/services/OnlineBookingAdminService.js',
		             './client/modules/onlineBooking_Admin/directives/RequirementDirective.js'
	])
	.pipe(concat('onlineBooking_Admin.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('outreferral', function(){
	return gulp.src(['./client/modules/outreferral/routes.js', 
					 './client/modules/outreferral/include.js',
					 './client/modules/outreferral/models/OutreferralModel.js',
					 './client/modules/outreferral/controllers/OutreferralPatientListController.js',
					 './client/modules/outreferral/directives/OutreferralPatientListDirective.js',
					 './client/modules/outreferral/directives/OutreferralPatientAddDirective.js',
					 './client/modules/outreferral/directives/OutreferralPatientShowDirective.js',
					 './client/modules/outreferral/directives/OutreferralPatientEditDirective.js',
	])
	.pipe(concat('outreferral.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('patient', function(){
	return gulp.src(['./client/modules/patient/js/patient_helper.js', 
					 './client/modules/patient/Patient.js',
					 './client/modules/patient/services/PatientServices.js',
					 './client/modules/patient/directives/PatientDirectives.js',
					 './client/modules/patient/directives/PatientDetail.js',
					 './client/modules/patient/directives/PatientWaitingList.js',
					 './client/modules/patient/directives/PatientClaim.js',
					 './client/modules/patient/directives/PatientOutsideReferral.js',
					 './client/modules/patient/directives/PatientSearch.js',
					 './client/modules/patient/directives/PatientCompanies.js',
					 './client/modules/patient/directives/ngThumb.js',
					 './client/modules/patient/controllers/PatientController.js',
					 './client/modules/patient/controllers/PatientListController.js',
					 './client/modules/patient/controllers/PatientAppointmentController.js',
					 './client/modules/patient/controllers/PatientCompaniesController.js',
					 './client/modules/patient/controllers/PatientRecallController.js',
					 './client/modules/patient/controllers/PatientInvoicesController.js',
					 './client/modules/patient/controllers/PatientInvoiceDetailController.js',
					 './client/modules/patient/controllers/PatientHomeController.js',
					 './client/modules/patient/controllers/PatientSearchController.js',
					 './client/modules/patient/controllers/PatientAddController.js',
					 './client/modules/patient/controllers/PatientActionController.js',
					 './client/modules/patient/controllers/PatientBookingController.js',
					 './client/modules/patient/controllers/PatientDetailController.js',
					 './client/modules/patient/controllers/PatientDetailMasterController.js',
					 './client/modules/patient/controllers/PatientWorkcoverController.js',
					 './client/modules/patient/controllers/PatientReferralsController.js',
					 './client/modules/patient/controllers/PatientOutsideReferralsController.js',
					 './client/modules/patient/controllers/PatientItemSheetController.js',
					 './client/modules/patient/controllers/PatientApptListController.js',
					 './client/modules/patient/controllers/PatientApptDocController.js',
					 './client/modules/patient/controllers/PatientListAllController.js',
					 './client/modules/patient/controllers/PatientCheckinController.js',
					 './client/modules/patient/directives/MakeCallService.js',
					 './client/modules/patient/modules/claim/Claim.js',
					 './client/modules/patient/modules/claim/services/ClaimService.js',
					 './client/modules/patient/modules/claim/controllers/ClaimController.js',
					 './client/modules/patient/modules/claim/controllers/ClaimListController.js',
					
	])
	.pipe(concat('patient.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('problem', function(){
	return gulp.src(['./client/modules/problem/Problem.js', 
					 './client/modules/problem/controllers/ProblemController.js',
					 './client/modules/problem/controllers/ProblemListController.js',
					 './client/modules/problem/directives/ProblemDirective.js',
					 './client/modules/problem/directives/ProblemDetailDirective.js',
					 './client/modules/problem/services/ProblemService.js',
	])
	.pipe(concat('problem.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('receptionist', function(){
	return gulp.src(['./client/modules/receptionist/Receptionist.js', 
					'./client/modules/receptionist/services/ReceptionistServices.js',
					'./client/modules/receptionist/directives/ReceptionistDirective.js',
					'./client/modules/receptionist/controllers/ReceptionistController.js',
					'./client/modules/receptionist/controllers/ReceptionistHomeController.js',
	])
	.pipe(concat('receptionist.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('rediLegalOnlineBooking', function(){
	return gulp.src(['./client/modules/rediLegalOnlineBooking/controllers/rlobController.js', 
					'./client/modules/rediLegalOnlineBooking/controllers/vaccinobController.js',
					'./client/modules/rediLegalOnlineBooking/js/rlob_helper.js',
					'./client/modules/rediLegalOnlineBooking/directives/rlob_directive.js',
					'./client/modules/rediLegalOnlineBooking/services/rlob_Service.js',
					'./client/modules/rediLegalOnlineBooking/rediLegalOnlineBooking.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_reportController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_messagesController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_report_type3Controller.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_report_type1Controller.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_admin_booking_report_type2Controller.js',
					'./client/modules/modules/rediLegalOnlineBooking/controllers/rlob_bookingController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_patientDetailController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_admin_bookingListController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_bookingDetailController.js',
					'./client/modules/rediLegalOnlineBooking/vaccinOnlineBooking.js',
					'./client/modules/rediLegalOnlineBooking/js/table-editable-lob-edited.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_bookingListController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_admin_documentStatusSummaryController.js',
					'./client/modules/rediLegalOnlineBooking/js/my-date-paginator.js',
					'./client/modules/kissModule/js/kiss.js',
					'./client/modules/kissModule/directives/kissTimerDirective.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_paperlessController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/paperless/rlob_paperless_ams6Controller.js',
					'./client/modules/rediLegalOnlineBooking/controllers/paperless/rlob_paperless_ams5Controller.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_rltypeController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_specialtiesController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/mobile/rlobSponsor1Controller.js',
					'./client/modules/rediLegalOnlineBooking/controllers/mobile/rlobCalendarMobileMasterController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/mobile/rlobEmergencyController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/mobile/rlobNonEmergencyController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlobRegisterController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_admin_redilegalUsersListController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlobBookingBehalfController.js',
					'./client/modules/rediLegalOnlineBooking/controllers/rlob_specialists_profilesController.js',
	])
	.pipe(concat('rediLegalOnlineBooking.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('referral', function(){
	return gulp.src(['./client/modules/referral/Referral.js', 
					'./client/modules/referral/directives/ReferralDirectives.js',
					'./client/modules/referral/directives/ReferralDetailDirective.js',
					'./client/modules/referral/controllers/referralController.js',
					'./client/modules/referral/controllers/referralListController.js',
					'./client/modules/referral/services/ReferralServices.js',
	])
	.pipe(concat('referral.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('script', function(){
	return gulp.src(['./client/modules/script/include.js', 
					'./client/modules/script/routes.js',
					'./client/modules/script/controllers/ScriptListController.js',
					'./client/modules/script/controllers/ScriptAddController.js',
					'./client/modules/script/controllers/ScriptEditController.js',
					'./client/modules/script/models/ScriptModel.js',
					'./client/modules/script/directives/ScriptListDirective.js',
					'./client/modules/script/directives/ScriptAddDirective.js',
					'./client/modules/script/directives/ScriptEditDirective.js',
	])
	.pipe(concat('script.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('security', function(){
	return gulp.src(['./client/modules/security/Security.js', 
					'./client/modules/security/services/SecurityServices.js',
					'./client/modules/security/controllers/SecurityController.js',
					'./client/modules/security/controllers/WebPatientController.js',
					'./client/modules/security/controllers/SecurityLoginController.js',
					'./client/modules/security/controllers/SecurityTermsController.js',
					'./client/modules/security/controllers/SecurityForgotController.js',
					'./client/modules/security/controllers/SecurityRegisterController.js',
					'./client/modules/security/controllers/SecurityRedirectController.js',
					'./client/modules/security/controllers/lockscreenController.js',
	])
	.pipe(concat('security.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('syscountry', function(){
	return gulp.src(['./client/modules/syscountry/sysCountry.js', 
					'./client/modules/syscountry/services/sysCountryServices.js',
					'./client/modules/syscountry/directives/sysCountryDirectives.js',
					'./client/modules/syscountry/directives/sysCountryDetailDirective.js',
					'./client/modules/syscountry/directives/sysCountrySearchDirective.js',
	])
	.pipe(concat('syscountry.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('sysqualification', function(){
	return gulp.src(['./client/modules/sysqualification/sysQualification.js', 
					'./client/modules/sysqualification/services/sysQualificationServices.js',
					'./client/modules/sysqualification/directives/sysQualificationDirectives.js',
					'./client/modules/sysqualification/directives/sysQualificationDetailDirective.js',
					'./client/modules/sysqualification/directives/sysQualificationSearchDirective.js'
	])
	.pipe(concat('sysqualification.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('sysrltypes', function(){
	return gulp.src(['./client/modules/sysrltypes/sysrlTypes.js', 
					'./client/modules/sysrltypes/services/sysrlTypesServices.js',
					'./client/modules/sysrltypes/directives/sysrlTypesDirectives.js',
					'./client/modules/sysrltypes/directives/sysrlTypesDetailDirective.js',
					'./client/modules/sysrltypes/directives/sysrlTypesSearchDirective.js',
	])
	.pipe(concat('sysrltypes.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('sysservice', function(){
	return gulp.src(['./client/modules/sysservice/sysService.js', 
					'./client/modules/sysservice/services/sysServiceServices.js',
					'./client/modules/sysservice/directives/sysServiceDirectives.js',
					'./client/modules/sysservice/directives/sysServiceDetailDirective.js',
					'./client/modules/sysservice/directives/sysServiceSearchDirective.js',
	])
	.pipe(concat('sysservice.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('sysservices', function(){
	return gulp.src(['./client/modules/sysservices/SysServices.js', 
					'./client/modules/sysservices/services/SysServicesServices.js',
					'./client/modules/sysservices/directives/SysServicesDirectives.js',
					'./client/modules/sysservices/directives/SysServicesDetailDirective.js',
					'./client/modules/sysservices/directives/SysServicesSearchDirective.js',
					'./client/modules/sysservices/controllers/SysServicesController.js',
					'./client/modules/sysservices/controllers/SysServicesListController.js',
	])
	.pipe(concat('sysservices.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('sysstate', function(){
	return gulp.src(['./client/modules/sysstate/sysState.js', 
					'./client/modules/sysstate/services/sysStateServices.js',
					'./client/modules/sysstate/directives/sysStateDirectives.js',
					'./client/modules/sysstate/directives/sysStateDetailDirective.js',
					'./client/modules/sysstate/directives/sysStateSearchDirective.js',
	])
	.pipe(concat('sysstate.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('systitle', function(){
	return gulp.src(['./client/modules/systitle/sysTitle.js', 
					'./client/modules/systitle/services/sysTitleServices.js',
					'./client/modules/systitle/directives/sysTitleDirectives.js',
					'./client/modules/systitle/directives/sysTitleDetailDirective.js',
					'./client/modules/systitle/directives/sysTitleSearchDirective.js',
	])
	.pipe(concat('systitle.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('telehealth', function(){
	return gulp.src(['./client/modules/telehealth/Telehealth.js', 
					'./client/modules/telehealth/controllers/TelehealthFormController.js',
					'./client/modules/telehealth/services/TelehealthService.js',
	])
	.pipe(concat('telehealth.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('template', function(){
	return gulp.src(['./client/modules/template/routes.js', 
					'./client/modules/template/include.js',
					'./client/modules/template/models/TemplateModel.js',
					'./client/modules/template/controllers/TemplateListController.js',
					'./client/modules/template/directives/TemplateListDirective.js',
					'./client/modules/template/controllers/TemplatePatientListController.js',
					'./client/modules/template/directives/TemplatePatientListDirective.js',
					'./client/modules/template/controllers/TemplatePatientAddController.js',
					'./client/modules/template/directives/TemplatePatientAddDirective.js',
					'./client/modules/template/directives/TemplatePatientWriteDirective.js',
					'./client/modules/template/directives/TemplatePatientEditDirective.js',
					'./client/modules/template/controllers/TemplateAddController.js',
					'./client/modules/template/directives/TemplateAddDirective.js',
					'./client/modules/template/controllers/TemplateWriteController.js',
					'./client/modules/template/directives/TemplateWriteDirective.js',
					'./client/modules/template/controllers/TemplateEditController.js',
					'./client/modules/template/directives/TemplateEditDirective.js',
	])
	.pipe(concat('template.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('timetable', function(){
	return gulp.src(['./client/modules/timetable/routes.js', 
					'./client/modules/timetable/include.js',
					'./client/modules/timetable/directives/TimetableCalendarDirective.js',
					'./client/modules/timetable/dialogs/TimetableCalendarAddDayDialog.js',
					'./client/modules/timetable/dialogs/TimetableCalendarEditDayDialog.js',
					'./client/modules/timetable/dialogs/TimetableCalendarAddSiteDialog.js',
					'./client/modules/timetable/models/TimetableModel.js'
	])
	.pipe(concat('timetable.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('treeApprove', function(){
	return gulp.src(['./client/modules/treeApprove/controllers/AllControllers.js', 
					'./client/modules/treeApprove/controllers/TreeDetail.js',
					'./client/modules/treeApprove/TreeApprove.js',
					'./client/modules/treeApprove/controllers/ListTreeController.js',
					'./client/modules/treeApprove/controllers/ListFunctionController.js',
					'./client/modules/treeApprove/directives/DirectiveAddNode.js',
					'./client/modules/treeApprove/directives/DirectiveAddFunction.js',
					'./client/modules/treeApprove/directives/DirectiveAddTree.js',
					'./client/modules/treeApprove/directives/DirectiveTree.js',
					'./client/modules/treeApprove/services/Service.js',	
	])
	.pipe(concat('treeApprove.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('user', function(){
	return gulp.src(['./client/modules/user/User.js', 
					'./client/modules/user/services/UserServices.js',
					'./client/modules/user/controllers/UserProfileController.js',
					'./client/modules/user/controllers/UserTypeController.js',		
	])
	.pipe(concat('user.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('waitingList', function(){
	return gulp.src(['./client/modules/waitingList/routes.js', 
					'./client/modules/waitingList/include.js',
					'./client/modules/waitingList/models/waitingListModel.js',
					'./client/modules/waitingList/directives/waitingListAddDirective.js',
					'./client/modules/waitingList/directives/waitingListListDirective.js'			
	])
	.pipe(concat('waitingList.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('waworkcover', function(){
	return gulp.src(['./client/modules/waworkcover/waworkcover.js', 
					'./client/modules/waWorkCover/directives/WaWorkCoverDirective.js',
					'./client/modules/waWorkCover/directives/WaWorkCoverFinalDirective.js',
					'./client/modules/waWorkCover/directives/WaWorkCoverFirstDirective.js',
					'./client/modules/waWorkCover/directives/WaWorkCoverProgressDirective.js',
					'./client/modules/waWorkCover/directives/WaWorkCoverGeneralDirective.js',
					'./client/modules/waworkcover/controllers/waworkcoverController.js', 
					'./client/modules/waworkcover/controllers/waworkcoverFinalController.js',
					'./client/modules/waworkcover/controllers/waworkcoverFirstController.js',
					'./client/modules/waworkcover/controllers/waworkcoverProgressController.js',
					'./client/modules/waWorkCover/controllers/waworkcoverGeneralController.js',
					'./client/modules/waworkcover/services/waworkcoverServices.js'					
	])
	.pipe(concat('waworkcover.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
}),
gulp.task('timeSheet', function(){
	return gulp.src(['./client/modules/TimeSheet/controllers/createTimesheetController.js', 
					 './client/modules/TimeSheet/controllers/viewTimesheetController.js',
					 './client/modules/TimeSheet/services/StaffService.js',
					 './client/modules/TimeSheet/directives/StaffCalendarDirective.js',
					 './client/modules/TimeSheet/controllers/TimeSheetHomeController.js',
					 './client/modules/TimeSheet/directives/TimeSheetDirectives.js',
					 './client/modules/TimeSheet/directives/TimeSheetItemCodeDirective.js',
					 './client/modules/TimeSheet/directives/TimeSheetOnlyDigits.js',
					 './client/modules/TimeSheet/directives/TimeSheetViewTaskDirective.js',
					 './client/modules/TimeSheet/directives/TimeSheetDetailDirective.js',
					 './client/modules/TimeSheet/directives/TimeSheetActivityDetailDirective.js',
					 './client/modules/TimeSheet/directives/TimeSheetFilter.js',
					 './client/modules/TimeSheet/directives/TimeSheetTimeDirective.js',
					 './client/modules/TimeSheet/services/TimeSheetServices.js',
					 './client/modules/TimeSheet/controllers/TimeSheetReport1Controller.js',
					 './client/modules/TimeSheet/controllers/TimeSheetReport2Controller.js',
					 './client/modules/TimeSheet/controllers/TimeSheetReport3Controller.js',
					 './client/modules/TimeSheet/controllers/TimeSheetReport4Controller.js',
					 './client/modules/TimeSheet/controllers/TimeSheetReport5Controller.js',
					 './client/modules/TimeSheet/controllers/TimeSheetReport6Controller.js',
					 './client/modules/TimeSheet/TimeSheet.js',
					 './client/modules/TimeSheet/controllers/TimeSheetApproveTaskController.js',
					 './client/modules/TimeSheet/controllers/TimeSheetCreateLeaveController.js',
					 './client/modules/TimeSheet/controllers/TimeSheetHistoryLeaveController.js',
					 './client/modules/TimeSheet/controllers/TimeSheetApproveLeaveController.js',
					 './client/modules/TimeSheet/directives/TimeSheetViewLeaveDirective.js',
					 './client/modules/TimeSheet/directives/TimeSheetViewLeaveApproveDirective.js',
					 './client/modules/TimeSheet/controllers/TimeSheetReportOweLeaveController.js',
					 './client/modules/TimeSheet/directives/TimeSheetValidateDirective.js'
					 
	])
	.pipe(concat('timeSheet.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
})
gulp.task('run', function(){
	return gulp.src(['./client/dist/common.js',
					'./client/dist/home.js',
					 './client/dist/appointment.js',
					 './client/dist/alert.js',
					 './client/dist/allergies.js',  
					 './client/dist/certificate.js',
					 './client/dist/claim.js',
					 './client/dist/company.js',  
					 './client/dist/consultation.js',
					 './client/dist/department.js',
					 './client/dist/doctor.js',  
					 './client/dist/document.js',
					 './client/dist/fadefine.js',
					 './client/dist/hrPayroll.js', 
					 './client/dist/function.js',
					 './client/dist/injuryManagement.js',
					 './client/dist/insurer.js',  
					 './client/dist/invoice.js',
					 './client/dist/iso.js',
					 './client/dist/item.js',  
					 './client/dist/kissModule.js',
					 './client/dist/makeCall.js',
					 './client/dist/mdtappointment.js',  
					 './client/dist/mdtdept.js',
					 './client/dist/mdtdoctor.js',
					 './client/dist/mdtinsurer.js', 
					 './client/dist/mdtoutdoctor.js',
					 './client/dist/mdtoutreferral.js',
					 './client/dist/mdtprovider.js',  
					 './client/dist/mdtrecall.js',
					 './client/dist/mdtredimedsites.js',
					 './client/dist/mdtspecialty.js',  
					 './client/dist/mdttimetable.js',
					 './client/dist/medicine.js',
					 './client/dist/menu.js',  
					 './client/dist/onlineBooking.js',
					 './client/dist/onlineBooking_Admin.js',
					 './client/dist/outreferral.js', 
					 './client/dist/patient.js',
					 './client/dist/problem.js',
					 './client/dist/receptionist.js',  
					 './client/dist/rediLegalOnlineBooking.js',
					 './client/dist/referral.js',
					 './client/dist/script.js',  
					 './client/dist/security.js',
					 './client/dist/syscountry.js',
					 './client/dist/sysqualification.js',  
					 './client/dist/sysrltypes.js',
					 './client/dist/sysservice.js',
					 './client/dist/sysservices.js', 
					 './client/dist/sysstate.js',
					 './client/dist/systitle.js',
					 './client/dist/telehealth.js', 
					 './client/dist/template.js',
					 './client/dist/timetable.js',
					 './client/dist/treeApprove.js',  
					 './client/dist/user.js',
					 './client/dist/waitingList.js',
					 './client/dist/waworkcover.js',  
					 './client/dist/timeSheet.js',
	])
	.pipe(concat('run.js'))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest('./client/dist/'));
})