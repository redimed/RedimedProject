angular.module("app.loggedIn.doctor.patients.detail.controller", [
    "app.loggedIn.doctor.patients.detail.appt.controller"
]).controller("DoctorPatientsDetailController", function ($scope, $state, $cookieStore, DoctorService, PatientService, localStorageService) {
  
    $scope.goToApptDetail = function (row) {
		localStorageService.set("apptTempInfo", {CAL_ID: row.CAL_ID});
        $state.go("loggedIn.doctor.patients.detail.appt");
    }

    var doctorInfo = $cookieStore.get("doctorInfo");

    var init = function () {
        if(!doctorInfo) {
            $state.go("loggedIn.doctor.patients");
            return;
        }
        var doctor_id = doctorInfo.doctor_id;

	    $scope.patient = localStorageService.get("patientTempInfo");
		if(!$scope.patient) {
			$state.go('loggedIn.doctor.home');
		}
		
        PatientService.getAppointment($scope.patient.Patient_id, doctor_id).then(function (data) {
            $scope.list_appt = data;
        });
		
		PatientService.getById ($scope.patient.Patient_id).then(function (data) {
            $scope.patient = data;
        });
		
    };
    init();
});
