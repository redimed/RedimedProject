angular.module("app.loggedIn.patient.workcover.controller", [
])
.controller("PatientWorkcoverController", function ($scope,  $stateParams, localStorageService) {
	localStorageService.set('patientTempInfo', {Patient_id:  $stateParams.patient_id }); 
	localStorageService.set('apptTempInfo', {CAL_ID:  $stateParams.cal_id }); 
});