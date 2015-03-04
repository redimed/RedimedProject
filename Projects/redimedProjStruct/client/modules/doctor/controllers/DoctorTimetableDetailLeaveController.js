angular.module("app.loggedIn.doctor.timetable.detail.leave.controller",[])

.controller("DoctorTimetableDetailLeaveController", function($scope, $state, $stateParams, DoctorService, ConfigService, mdtDoctorService, mdtTimetableService, sysServiceService, REAL_DAY_OF_WEEK, toastr){
	$scope.doctor_id = $stateParams.doctorId;
	$scope.isSubmit = false;

	var from_time = null;
	var today = new Date();

	$scope.objectMap = {};
	$scope.objectMap.from_time = ConfigService.convertToDate(today);
	today.setDate(today.getDate() + 30);
	$scope.objectMap.to_time = ConfigService.convertToDate(today);

	$scope.goToAppointment = function(appt, patient) {
		$state.go("loggedIn.patient.appointment", {cal_id: appt.CAL_ID, patient_id: patient.Patient_id});
	}

	$scope.submitLeave = function() {
		var str_from_time = ConfigService.getCommonDateDatabase($scope.objectMap.from_time);
		var str_to_time = ConfigService.getCommonDateDatabase($scope.objectMap.to_time) + ' 59:59';		

		DoctorService
		.leaveCalendar($scope.doctor_id, str_from_time , str_to_time)
		.then(function(response){

			if(response.status == 'success') {
				$scope.isSubmit = true;
				$scope.booking =  response.data;
				angular.forEach($scope.booking, function(value, key) {
					value.FROM_TIME =  ConfigService.convertToDatetime(value.FROM_TIME);
					value.TO_TIME =  ConfigService.convertToDatetime(value.TO_TIME);
					value.PATIENTS = JSON.parse(value.PATIENTS);
				})
					console.log($scope.booking)
				toastr.success('Leave successfully !!!', 'Success')
			}
		})

	}
})