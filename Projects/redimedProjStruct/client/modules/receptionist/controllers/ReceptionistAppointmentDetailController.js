angular.module("app.loggedIn.receptionist.appointment.detail.controller", [])

.controller("ReceptionistAppointmentDetailController", function($scope, $stateParams, ReceptionistService){
	$scope.appointment = {CAL_ID: $stateParams.cal_id, Patient_id: $stateParams.patient_id};
	// $scope.itemsheet  
	
})