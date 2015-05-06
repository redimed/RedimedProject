angular.module("app.loggedIn.doctor.home.controller",[])

.controller("DoctorHomeController", function($scope, $state, $cookieStore, DoctorService, ConfigService, localStorageService, toastr, moment){

	var nowtime = moment();
	$scope.doctorInfo = $cookieStore.get('doctorInfo');

	console.log("Doctor Info: ",$scope.doctorInfo);

	if(!$scope.doctorInfo || !$scope.doctorInfo.doctor_id) {
		alert('Not Doctor Information !!!')
	}

	$scope.selectDate = moment().range(moment().subtract(1, 'days'), moment());

	$scope.loadCalendar = function(){

		// var query_date = moment($scope.selectDate).format("YYYY-MM-DD");

		var fromDate = moment(($scope.selectDate.start).format("YYYY-MM-DD"));

		var toDate = moment(($scope.selectDate.end).format("YYYY-MM-DD"));

		var doctor_id = $scope.doctorInfo.doctor_id;

		DoctorService.doctor_calendar_by_date(doctor_id, fromDate, toDate).then(function(data){
			$scope.list_appts = data.list;

			angular.forEach($scope.list_appts, function(value, key) {
				value.FROM_TIME =  moment(value.FROM_TIME).format("DD/MM/YYYY - hh:mm");
				value.TO_TIME =  moment(value.TO_TIME).format("DD/MM/YYYY - hh:mm");

				var patientArr = [];
				patientArr.push(value.Title,value.First_name,value.Sur_name,value.Middle_name);
				value.PATIENT_NAME = patientArr.join(' ');
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