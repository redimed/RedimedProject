angular.module("app.loggedIn.patient.detail.controller", [])

.controller("PatientDetailController", function($scope, $state, $cookieStore, ConfigService, ReceptionistService, toastr){
	$scope.mode = 'view';
	$scope.label_update_view = "Update Appointment";

	$scope.tab = [
		{'name': 'Appointment Info', 'type': 'A', 'class': 'active'},
		{'name': 'Patient Info', 'type': 'B', 'class':''}
	]

	$scope.tab_current = $scope.tab[0];

	$scope.getClass = function(t){
		for(var i = 0; i < $scope.tab.length; i++){
			if(t.type === $scope.tab[i].type){
				$scope.tab[i].class = 'active';
				$scope.tab_current = $scope.tab[i];
			}else{
				$scope.tab[i].class = '';
			}
		}
	}

	// INIT
	$scope.modelObjectBookingMap = {};
	$scope.bookingPatientInfo = {};
	var init = function(){
		$scope.bookingPatientInfo = $cookieStore.get("patientBookingInfo").data;
		$scope.bookingPatientInfo.datepicker = ConfigService.getCommonDateDefault($scope.bookingPatientInfo.datepicker);

		ReceptionistService.getById($cookieStore.get("patientBookingInfo").cal_id).then(function(data){
			angular.extend($scope.modelObjectBookingMap, data);

			ConfigService.system_service_by_clinical($scope.modelObjectBookingMap.CLINICAL_DEPT_ID).then(function(list){
	            $scope.options.services = list;

	            $scope.modelObjectBookingMap.ARR_TIME = ConfigService.convertToTimeString($scope.modelObjectBookingMap.ARR_TIME);
	            $scope.modelObjectBookingMap.ATTEND_TIME = ConfigService.convertToTimeString($scope.modelObjectBookingMap.ATTEND_TIME);

	            /*$scope.modelObjectBookingMap.SERVICE_ID = list[0].SERVICE_ID;
	            $scope.modelObjectBookingMap.ACC_TYPE = $scope.options.acc_types[0].code;
	            $scope.modelObjectBookingMap.APP_TYPE = $scope.options.app_types[0].code;
	            $scope.modelObjectBookingMap.bill_to = "1";
	            $scope.modelObjectBookingMap.ARR_TIME = "00:00";
	            $scope.modelObjectBookingMap.ATTEND_TIME = "00:00";*/
	        })
		})
	}

    init();
	// END INIT

	// ACTION DELETE
	$scope.deleteAppointment = function(){
		var cal_id = $cookieStore.get("patientBookingInfo").cal_id;

		ReceptionistService.deleteBooking({'cal_id': cal_id}).then(function(response){
			$state.go("loggedIn.receptionist.appointment");
		})
	}
	// END ACTION DELETE

	// ACTION UPDATE
	$scope.updateAppointment = function(){
		if($scope.mode === 'view') $scope.mode = 'update';
		else $scope.mode = 'view';
		$scope.label_update_view = ($scope.mode === 'view')?"Update Appointment":"Change to View Appointment";
	}
	// END ACTION UPDATE

	// UPDATE BOOKING
	$scope.updateBooking = function(){
		ReceptionistService.updateBooking($scope.modelObjectBookingMap).then(function(response){
			if(response.status === 'success'){
				toastr.success("Updated Successfully", "Success");
				init();
			}
		})
	}
	// END UPDATE BOOKING

})