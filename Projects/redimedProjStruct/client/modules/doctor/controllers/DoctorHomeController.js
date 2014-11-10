angular.module("app.loggedIn.doctor.home.controller",[])

.controller("DoctorHomeController", function($scope, $state, $cookieStore, DoctorService, localStorageService){
	//$scope.data = [500, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
	
	$scope.goToApptDetail = function (row) {
		localStorageService.set("apptTempInfo", {CAL_ID: row.CAL_ID});
		var patientTempt = {
			Patient_id: row.p_id,
			Title: row.Title,
			Sur_name: row.Sur_name
		}
		localStorageService.set("patientTempInfo", patientTempt);
        $state.go("loggedIn.doctor.patients.detail.appt");
    }

	
	var init = function(){
		//var doctor_id = 
		$scope.doctorInfo = $cookieStore.get('doctorInfo');
		
		DoctorService.listCurPatients($scope.doctorInfo.doctor_id).then(function(data){
			console.log(data);
			$scope.list_appts = data;
		});
	}
	
	init();
})