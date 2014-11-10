angular.module("app.loggedIn.doctor.patients.detail.controller", [
    "app.loggedIn.doctor.patients.detail.appt.controller"
]).controller("DoctorPatientsDetailController", function ($scope, $state, $cookieStore, DoctorService, PatientService, localStorageService) {
    $scope.setClassAppt = function (row) {
        if (row.APP_TYPE === null)
            return 'danger';
        if (row.APP_TYPE === 'Done')
            return 'success';
        if (row.APP_TYPE === 'NotYet')
            return 'warning';
        if (row.APP_TYPE === 'Billing')
            return 'info';
    }

    $scope.goToApptDetail = function (row) {
        // row.CAL_ID
        // $cookieStore.put("apptTempInfo", row);
		localStorageService.set("apptTempInfo", row);
        $state.go("loggedIn.doctor.patients.detail.appt");
    }

    var init = function () {
       // $scope.patient = $cookieStore.get("patientTempInfo");
	    $scope.patient = localStorageService.get("patientTempInfo");
	
		
//                $cookieStore.remove('patientTempInfo');
        // console.log($scope.patient);
        PatientService.getAppointment($scope.patient.Patient_id).then(function (data) {
            // console.log(data)
            $scope.list_appt = data;
        });
		
		PatientService.getById ($scope.patient.Patient_id).then(function (data) {
            console.log(data);
            $scope.patient = data;
        });
		
    };
    init();
});
