angular.module("app.loggedIn.doctor")
.controller("DoctorPatientsDetailController", function ($scope, $state, $cookieStore, DoctorService, PatientService, localStorageService) {
  
    $scope.goToApptDetail = function (row) {
        var cal_id = row.CAL_ID;
        var patient_id = $scope.patient.Patient_id;
        $state.go("loggedIn.patient.appointment", {patient_id: patient_id, cal_id: cal_id});
		// localStorageService.set("apptTempInfo", {CAL_ID: row.CAL_ID});
  //       $state.go("loggedIn.doctor.patients.detail.appt");
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
