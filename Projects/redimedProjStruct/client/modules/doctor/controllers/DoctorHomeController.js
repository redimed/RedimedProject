angular.module("app.loggedIn.doctor.home.controller",[])

.controller("DoctorHomeController", function($scope, $state, $cookieStore, DoctorService, ConfigService, localStorageService){

	var nowtime = moment();
	var doctorInfo = $cookieStore.get('doctorInfo');

	if(!doctorInfo || !doctorInfo.doctor_id) {
		alert('Not Doctor Information !!!')
	}

	$scope.selectDate = {
		year: nowtime.year(),
		month: nowtime.month() + 1,
		date: nowtime.date(),
	}

	$scope.loadCalendar = function(){
		console.log($scope.selectDate)
		var doctor_id = doctorInfo.doctor_id;

		DoctorService.doctor_calendar_by_date(doctor_id, $scope.selectDate).then(function(data){
			$scope.list_appts = data.list;


			angular.forEach($scope.list_appts, function(value, key) {
				value.FROM_TIME =  ConfigService.convertToDatetime(value.FROM_TIME);
				value.TO_TIME =  ConfigService.convertToDatetime(value.TO_TIME);
				
				value.PATIENTS = JSON.parse(value.PATIENTS);
			})

			console.log($scope.list_appts);
		}, function(err) {
			console.log(err);
		});
	}

	$scope.goToApptDetail = function (patient, appt) {
		if(!patient.Patient_id || !appt.CAL_ID) {
			alert('Patient or appointment');
			return;
		}
  		$state.go("loggedIn.patient.appointment", {patient_id: patient.Patient_id, cal_id: appt.CAL_ID});
    }

	
	var init = function(){
		//var doctor_id = 
		
		$scope.loadCalendar();
	}
	
	init();
})