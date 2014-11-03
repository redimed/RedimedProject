angular.module("app.loggedIn.receptionist.appointment.controller", [])

.controller("ReceptionistAppointmentController", function ($scope, $state, $timeout, $modal, $cookieStore, ConfigService, DoctorService, ReceptionistService, PatientService) {
	$scope.modelObjectMap = {};
	$scope.overviewAppointment = [];

	var init = function(){
		$scope.modelObjectMap = angular.copy($scope.modelObject);
		ConfigService.redimed_sites_option().then(function(list){
			$scope.options.redimedsites = list;
			$scope.modelObjectMap.site = parseInt(list[0].id);

			ConfigService.clinical_option().then(function(list){
				$scope.options.dept = list;
				$scope.modelObjectMap.dept = parseInt(list[0].CLINICAL_DEPT_ID);

				ConfigService.system_service_by_clinical(list[0].CLINICAL_DEPT_ID).then(function(list){
					$scope.options.services = list;
				})

				loadAppointmentOverview($scope.modelObjectMap);
			});
		});
	}

	var loadAppointmentOverview = function(options){
		var modelObjectMap_map = {
			datepicker_map: ConfigService.getCommonDate($scope.modelObjectMap.datepicker)
		};

		angular.extend(modelObjectMap_map, $scope.modelObjectMap);

		DoctorService.listByClinical(modelObjectMap_map).then(function(doctors){
			if(doctors.length > 0){
				$scope.options.doctors = doctors;
				$scope.modelObjectMap.doctor = parseInt(doctors[0].DOCTOR_ID);

				$scope.overviewAppointment = [];

				ReceptionistService.getAppointmentOverview(modelObjectMap_map).then(function(data){
					for(var i = 0; i < data.length; i++){
						var from_time_map = ConfigService.convertToTimeString(data[i].FROM_TIME);
						var to_time_map = ConfigService.convertToTimeString(data[i].TO_TIME);
						$scope.overviewAppointment.push(
							{
								from_time: data[i].FROM_TIME, 
								from_time_map:from_time_map,
								to_time: data[i].TO_TIME, 
								to_time_map:to_time_map
							}
						);

						var doctors = data[i].doctor.split(",");
						var statuses = data[i].status.split(",");
						var cals = data[i].CAL_ID.split(",");

						$scope.overviewAppointment[i].statuses = [];
						$scope.overviewAppointment[i].doctors = [];
						$scope.overviewAppointment[i].cals = [];
						for(var j = 0; j < $scope.options.doctors.length; j++){
							var flag = false;
							for(var k = 0; k < doctors.length; k++){
								if($scope.options.doctors[j].DOCTOR_ID == doctors[k]){
									flag = k;
								}
							}
							if(flag !== false){
								$scope.overviewAppointment[i].doctors.push(doctors[flag]);
								$scope.overviewAppointment[i].statuses.push(statuses[flag]);
								$scope.overviewAppointment[i].cals.push(cals[flag]);
							}else{
								$scope.overviewAppointment[i].doctors.push("");
								$scope.overviewAppointment[i].statuses.push("");
								$scope.overviewAppointment[i].cals.push("");
							}
						}
					}
				})
			}else{
				$scope.options.doctors = [];
				$scope.overviewAppointment = [];
			}
		});
	}

	$scope.goToAppointmentDoctor = function(doctor){
		$scope.modelObjectMap.doctor = doctor.DOCTOR_ID;
		$cookieStore.put("appointmentDoctor", $scope.modelObjectMap);
		$state.go("loggedIn.receptionist.appointment.doctor");
	}

	$scope.refreshAppointment = function(){
		loadAppointmentOverview($scope.modelObjectMap);
		$scope.modelObjectBookingMap = angular.copy($scope.modelObjectBooking);
	}

	/* BOOKING */
	$scope.bookingPatient = function(data, parentIndex, index){
		var modalTemp = {
			templateUrl: "modules/patient/views/popup/action.html",
			controller: "PatientActionController",
		}

		var modalInstance = $modal.open({
			templateUrl: modalTemp.templateUrl,
			size: "lg",
			controller: modalTemp.controller,
			resolve: {
		        items: function () {
		        	return {cal_id: data.cals[index], bookingObject: $scope.modelObjectBooking, data: data, options: $scope.options};
		        }
		    }
		});

		modalInstance.result.then(function(data){
			$scope.refreshAppointment();
		});
	}
	/* END BOOKING */

	init();

	// CONTEXT MENU
	$scope.list_of_booking = [];

	$scope.chooseBooking = function($event, options){
		//CLEAR COLOR
		for(var i = 0; i < $scope.list_of_booking.length; i++){
			angular.element($scope.list_of_booking[i]).css("background", "none");
		}
		//END CLEAR COLOR

		// RESET AND PUSH LIST BOOKING
		if(!$event.altKey)
			$scope.list_of_booking = [];
		$scope.list_of_booking.push("#status"+options.overId+options.docId);
		// END

		// BACKGROUND COLOR
		for(var i = 0; i < $scope.list_of_booking.length; i++){
			angular.element($scope.list_of_booking[i]).css("background", "yellow");
		}
		//END BACKGROUND COLOR
	}
	//END CONTEXT MENU
})