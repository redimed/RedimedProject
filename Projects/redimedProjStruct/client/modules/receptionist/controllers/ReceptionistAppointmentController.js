angular.module("app.loggedIn.receptionist.appointment.controller", [])

.controller("ReceptionistAppointmentController", function ($scope, $state, $timeout, $modal, $cookieStore, ConfigService, DoctorService, ReceptionistService, PatientService) {
	$scope.modelObjectMap = {};
	$scope.overviewAppointment = [];

	var init = function(){
		if($cookieStore.get("patientBookingInfo")){
			$scope.modelObjectMap = angular.copy($cookieStore.get("patientBookingInfo").data);
			$scope.modelObjectMap.datepicker = new Date($scope.modelObjectMap.datepicker);
		}else{
			$scope.modelObjectMap = angular.copy($scope.modelObject);
		}

		ConfigService.redimed_sites_option().then(function(list){
			$scope.options.redimedsites = list;

			if(!$cookieStore.get("patientBookingInfo")){
				$scope.modelObjectMap.site = parseInt(list[0].id);
			}

			ConfigService.clinical_option().then(function(list){
				$scope.options.dept = list;
				if(!$cookieStore.get("patientBookingInfo")){
					$scope.modelObjectMap.dept = parseInt(list[0].CLINICAL_DEPT_ID);
				}

				ConfigService.system_service_by_clinical($scope.modelObjectMap.dept).then(function(list){
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
						var patients = data[i].PATIENT.split(",");

						$scope.overviewAppointment[i].statuses = [];
						$scope.overviewAppointment[i].doctors = [];
						$scope.overviewAppointment[i].cals = [];
						$scope.overviewAppointment[i].patients = [];
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
								$scope.overviewAppointment[i].patients.push(patients[flag]);
							}else{
								$scope.overviewAppointment[i].doctors.push("");
								$scope.overviewAppointment[i].statuses.push("");
								$scope.overviewAppointment[i].cals.push("");
								$scope.overviewAppointment[i].patients.push("");
							}
						}
					}// end for
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
		$scope.modelObjectMap.FROM_TIME = data.from_time_map;
		$scope.modelObjectMap.TO_TIME = data.to_time_map;		

		$cookieStore.put("patientBookingInfo", {
			cal_id: data.cals[index],
			data: $scope.modelObjectMap,

		});

		ReceptionistService.getById(data.cals[index]).then(function(data){
			if(data.Patient_id === null){
				$state.go("loggedIn.patient.booking");
			}else{
				$state.go("loggedIn.patient.detail");
			}
		})

		/*var modalTemp = {
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
		});*/
	}
	/* END BOOKING */

	init();

	// CONTEXT MENU
	$scope.list_of_booking = [];

	// RIGHT POPUP MENU
	var closePopupMenu = function(){
		angular.element("#popupMenu").css("display", "none");
	}

	var clearSelectedBooking = function(){
		var newArray = [];

		for(var i = 0; i < $scope.list_of_booking.length; i++){
			if(!$scope.list_of_booking[i].isenable)
				newArray.push($scope.list_of_booking[i]);
		}

		$scope.list_of_booking = angular.copy(newArray);
	}

	var clearColorBooking = function(){
		for(var i = 0; i < $scope.list_of_booking.length; i++){
			if($scope.list_of_booking[i].isenable)
				angular.element($scope.list_of_booking[i].id).css("background", "none");
		}
	}

	var isSelectedBooking = function(options){
		var flag = -1;

		for(var i = 0; i < $scope.list_of_booking.length; i++){
			if("#status"+options.overId+options.docId === $scope.list_of_booking[i].id){
				flag = i;
				break;
			}
		}

		return flag;
	}
	// END RIGHT POPUP MENU

	$scope.chooseBooking = function($event, options){
		if(options.status !== ''){
			var isSelected = isSelectedBooking(options);
			var mutiple = false;

			closePopupMenu();
			clearColorBooking();

			// RESET AND PUSH LIST BOOKING
			if(!$event.altKey){
				clearSelectedBooking();
			}else{
				mutiple = true;
			}

			if(-1 === isSelected){
				$scope.list_of_booking.push({"id":"#status"+options.overId+options.docId, "isenable":true});
				// BACKGROUND COLOR
				for(var i = 0; i < $scope.list_of_booking.length; i++){
					if($scope.list_of_booking[i].isenable)
						angular.element($scope.list_of_booking[i].id).css("background", "yellow");
				}
				//END BACKGROUND COLOR
			}else{
				$scope.list_of_booking.splice(isSelected, 1);
			}
			// END
		}
	}
	//END CONTEXT MENU

	$scope.rightClickAction = function($event){
		if($scope.list_of_booking.length > 0){
			angular.element("#popupMenu").css({
				'display': 'block',
				'top': $event.clientY-68,
				'left': $event.clientX-20
			});
		}
	}

	angular.element("body").bind("click", function($event){
		if(angular.element($event.target).closest("#main-table").length === 0){
			if(angular.element($event.target).closest("#popupMenu").length === 0){
				angular.element("#popupMenu").css("display", "none");
				//CLEAR COLOR
				clearColorBooking();
				//END CLEAR COLOR
				clearSelectedBooking();
				$event.preventDefault();
			}
		}
	})

	// ACTION RIGHT MENU
	$scope.showUnavailable = function(){
		if($scope.list_of_booking.length > 0){
			for(var i = 0; i < $scope.list_of_booking.length; i++){
				angular.element($scope.list_of_booking[i].id).css("background", "rgb(61,74,83)");
				$scope.list_of_booking[i].isenable = false;
			}

			angular.element("#popupMenu").css("display", "none");
		}
	}
	// END ACTION RIGHT MENU
})