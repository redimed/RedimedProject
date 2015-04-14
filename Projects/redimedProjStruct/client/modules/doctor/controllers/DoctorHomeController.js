angular.module("app.loggedIn.doctor.home.controller",[])

.controller("DoctorHomeController", function($scope, $state, $cookieStore, DoctorService, ConfigService, localStorageService, toastr, moment){

	var nowtime = moment();
	var doctorInfo = $cookieStore.get('doctorInfo');

	if(!doctorInfo || !doctorInfo.doctor_id) {
		alert('Not Doctor Information !!!')
	}

	$scope.loadCalendar = function(){
		var query_date = moment($scope.selectDate).format("YYYY-MM-DD");
		var doctor_id = doctorInfo.doctor_id;

		DoctorService.doctor_calendar_by_date(doctor_id, query_date).then(function(data){
			$scope.list_appts = data.list;


			angular.forEach($scope.list_appts, function(value, key) {
				value.FROM_TIME =  moment(value.FROM_TIME).format("hh:mm");
				value.TO_TIME =  moment(value.TO_TIME).format("hh:mm");
				
				value.PATIENTS = JSON.parse(value.PATIENTS);
			})

			console.log($scope.list_appts);
		}, function(err) {
			console.log(err);
		});
	}

	$scope.goToApptDetail = function (item) {
		console.log('this is item',item);
		if(!item.CAL_ID || !item.Patient_id) {
			toastr.error('Unexpected error!','Error!')
			return;
		}
  		$state.go("loggedIn.patient.appointment", {patient_id: item.Patient_id, cal_id: item.CAL_ID});
    }

	
	var init = function(){
		//var doctor_id = 
		
		$scope.loadCalendar();
	}
	
	init();
})