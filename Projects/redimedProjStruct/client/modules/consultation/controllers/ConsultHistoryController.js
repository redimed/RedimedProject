angular.module("app.loggedIn.patient.consult.consulthistoryController", [])
.controller("ConsultHistoryController", function($scope, ConsultationService, consult_id, $modalInstance){
	//get history
	$scope.setListConsultHistory = function(){
		ConsultationService.getByIdConsult(consult_id).then(function(response){
			if (response.status == 'success') {
				$scope.listConsult = response.data;
				console.log($scope.listConsult);
				//set list drawing img
				ConsultationService.getImgDrawingHistory(response.data.patient_id,response.data.cal_id).then(function(data){
					if (data.status == 'success') {
						$scope.listImgDrawingHistory = data.data;
					};
				});
				//set document
				ConsultationService.getDocumentFileOfPatientidAndCalid(response.data.patient_id,response.data.cal_id).then(function(data){
					if (data.status == 'success') {
						$scope.listDocumentFile = data.data;
					};
				});
				//set Measurements
				ConsultationService.getListMeasurementsOfConsualt(response.data.patient_id,response.data.cal_id).then(function(data){
					if (data.status == 'success') {
						$scope.listMeasurementsConsual = data.data;
					}
				});
				//set medication
				ConsultationService.getListMedicationOfConsualt(response.data.patient_id,response.data.cal_id).then(function(data){
					if (data.status == 'success') {
						$scope.listMedicationConsualt = data.data;
					}
				});
			};
		});
	};
	$scope.setListConsultHistory();
	//close popup
	$scope.cancelDetail = function(){
		$modalInstance.close({'type':'cancel'});
	};

	$scope.popupMedication = function () {
		angular.element('#popupListMedicationOfConsualt').modal('show');
	};
	$scope.popupMeasurements = function () {
		angular.element('#popupListMeasurementsOfConsualt').modal('show');
	};
})