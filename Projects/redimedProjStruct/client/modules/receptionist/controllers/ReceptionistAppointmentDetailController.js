angular.module("app.loggedIn.receptionist.appointment.detail.controller", [])

.controller("ReceptionistAppointmentDetailController", function($scope, $stateParams, ReceptionistService){
	$scope.appointment = {CAL_ID: $stateParams.cal_id};
	// $scope.itemsheet  
	
})