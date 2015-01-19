angular.module("app.loggedIn.patient.recall.controller", [])
.controller("PatientRecallController", function($scope, $state, $stateParams, PatientService, ConfigService){
	var patient_id = $stateParams.patient_id;
    var cal_id = $stateParams.cal_id;

	PatientService.getRecallAppointments(patient_id)
	.then(function(response){
		$scope.appt_list = response.data;

		angular.forEach($scope.appt_list, function(item){
			item.appointment.FROM_TIME = ConfigService.getCommonDatetime(item.appointment.FROM_TIME);
		})
	})
});