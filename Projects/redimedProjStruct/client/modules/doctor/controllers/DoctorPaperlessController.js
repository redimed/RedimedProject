angular.module("app.loggedIn.doctor.paperless.controller", [])

.controller("DoctorPaperlessController", function($scope, DocumentService, PatientService, $stateParams, localStorageService){
	var patient_id = $stateParams.patient_id;


	$scope.OptionGorgonMA = DocumentService.optionGorgonMA(patient_id);

	$scope.OptionGorgonFA = DocumentService.optionGorgonFA(patient_id);

	$scope.OptionGorgonUQ = DocumentService.optionGorgonUQ(patient_id);

	$scope.OptionGorgonMH = DocumentService.optionGorgonMH(patient_id);


})