angular.module("app.loggedIn.receptionist.appointment.controller", [])

.controller("ReceptionistAppointmentController", function ($scope, $state, $timeout, $modal, $cookieStore, ConfigService, DoctorService, ReceptionistService, PatientService, localStorageService) {
	$scope.modelObjectMap = {};
	$scope.overviewAppointment = [];

	$scope.claim_params = {
		permission: {
			create: true,
			edit: false
		}
	}

	$scope.params = {
		permission: {
			create: true,
			edit: false
		}
	}

	$scope.extra = {
		service_id: 0
	}

	$scope.refreshPopup = {
		booking: false
	}

	//DECLARE
	var waitingListSelectId = "#waitingListSelectModule";
	var appointmentPatientSearchId = "#appointmentPatientSearch";
	var claimListSelectId = "#ClaimListSelectModule";
	var claimListAddId = "#ClaimListAddModule";

	$scope.rightSelectedBooking = {};
	$scope.selectedCalId = 0;
	$scope.dataBooking = {};
	//END DECLARE

	// LEFT CLICK BOOKING
	$scope.chooseBooking = function($event, option){
		var slotId = "#status"+option.overId+option.docId;
		//angular.element(slotId).css({"background-color": "yellow"});
	}
	// END LEFT CLICK BOOKING

	// WATCH PATIENT ID
	$scope.$watch("patient", function(newPatient){
		if(typeof newPatient !== 'undefined' && newPatient !== null){
			$scope.patient_id = newPatient.Patient_id;
			angular.element(claimListAddId).fadeIn();
			$scope.refreshAppointment();
		}
	})

	$scope.addClaim = function(){
		angular.element(claimListAddId).fadeIn();
	}

	$scope.$watch('claim', function(newClaim, oldClaim){
		if(typeof newClaim !== 'undefined'){
			angular.element(claimListSelectId).fadeOut();
			angular.element(claimListAddId).fadeOut();
		}
	});
	// END WATCH PATIENT ID

	// RIGHT CLICK BOOKING
	$scope.chooseBookingAction = function($event, option){
		$scope.rightSelectedBooking.data = option.data;
		$scope.rightSelectedBooking.overId = option.overId;
		$scope.rightSelectedBooking.docId = option.docId;

		var slotId = "#status"+option.overId+option.docId;

		angular.element("#popupMenu").css({
			'display': 'block',
			'top': $event.pageY-68,
			'left': $event.pageX-20
		});
	}
	// END RIGHT CLICK BOOKING

	// GET CLICK ADD OR SELECT PATIENT
	$scope.clickPatient = function(type){
		var patientPopupId = "#patientModule";

		if(type === 'add'){
			angular.element(patientPopupId).fadeIn();
		}else if(type === 'select'){
			angular.element(appointmentPatientSearch).fadeIn();
		}
	}

	$scope.selectPatient = function(row){
		var dataBooking = {
			CAL_ID: $scope.rightSelectedBooking.data.cals[$scope.rightSelectedBooking.docId],
			patients: $scope.rightSelectedBooking.data.patients[$scope.rightSelectedBooking.docId],
		}

		dataBooking.Patient_id = row.Patient_id;

		if(dataBooking.patients[0].Patient_id !== 0){
			dataBooking.patients.push({Patient_id: dataBooking.Patient_id, Patient_name: row.First_name+" "+row.Sur_name});
			dataBooking.PATIENTS = JSON.stringify(dataBooking.patients);
		}else{
			dataBooking.PATIENTS = JSON.stringify([{Patient_id: dataBooking.Patient_id, Patient_name: row.First_name+" "+row.Sur_name}]);
		}

		$scope.patient = {};
		$scope.patient = row;
				$scope.patient.Patient_name = row.First_name+" "+row.Sur_name;

		angular.element("#bookingModule").fadeOut();
        angular.element(appointmentPatientSearch).fadeOut();
	}
	// END GET CLICK ADD OR SELECT PATIENT

	// ADD WAITING LIST
	$scope.addWaitingList = function(){
		var waitingListId = "#waitingListAddModule";

		angular.element(waitingListId).fadeIn();
	}

	$scope.openWaitingList = function(){
		angular.element(waitingListSelectId).fadeIn();	
	}

	$scope.selectWaitingList = function(row){
		var dataBooking = {
			CAL_ID: $scope.rightSelectedBooking.data.cals[$scope.rightSelectedBooking.docId],
			patients: $scope.rightSelectedBooking.data.patients[$scope.rightSelectedBooking.docId],
		}

		dataBooking.Patient_id = row.Patient_id;

		if(dataBooking.patients[0].Patient_id !== 0){
			dataBooking.patients.push({Patient_id: dataBooking.Patient_id, Patient_name: row.First_name+" "+row.Sur_name});
			dataBooking.PATIENTS = JSON.stringify(dataBooking.patients);
		}else{
			dataBooking.PATIENTS = JSON.stringify([{Patient_id: dataBooking.Patient_id, Patient_name: row.First_name+" "+row.Sur_name}]);
		}

		ReceptionistService.booking(dataBooking).then(function(data){
            if(data.status === 'success'){
            	angular.element(waitingListSelectModule).fadeOut();
            	$scope.refreshAppointment();
            }
            
        })
	}
	// END ADD WAITING LIST

	// GLOBAL CLICK
	angular.element("#appointment").on("click", function(){
		angular.element("#popupMenu").css({'display':'none'});
	})
	// END GLOBAL CLICK

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

				ReceptionistService.getAppointmentOverview(modelObjectMap_map).then(function(data){

					$scope.overviewAppointment = [];

					for(var i = 0; i < data.length; i++){
						var from_time_map = ConfigService.convertToTimeStringApp(data[i].FROM_TIME);
						var to_time_map = ConfigService.convertToTimeStringApp(data[i].TO_TIME);
						$scope.overviewAppointment.push(
							{
								from_time: data[i].FROM_TIME, 
								from_time_map:from_time_map,
								to_time: data[i].TO_TIME, 
								to_time_map:to_time_map
							}
						);

						var doctors = data[i].doctor.split(",");
						var cals = data[i].CAL_ID.split(",");
						if(data[i].SERVICES !== null){
							var services = data[i].SERVICES.split(",");
						}

						if(data[i].SERVICE_COLORS !== null){
							var service_colors = data[i].SERVICE_COLORS.split(",");
						}

						var patients = data[i].PATIENTS.split("|");

						$scope.overviewAppointment[i].doctors = [];
						$scope.overviewAppointment[i].cals = [];
						$scope.overviewAppointment[i].patients = [];
						$scope.overviewAppointment[i].service_colors = [];
						$scope.overviewAppointment[i].services = [];
						for(var j = 0; j < $scope.options.doctors.length; j++){
							var flag = false;
							for(var k = 0; k < doctors.length; k++){
								if($scope.options.doctors[j].DOCTOR_ID == doctors[k]){
									flag = k;
								}
							}
							if(flag !== false){
								$scope.overviewAppointment[i].doctors.push(doctors[flag]);
								$scope.overviewAppointment[i].cals.push(cals[flag]);

								if(data[i].SERVICES !== null){
									$scope.overviewAppointment[i].services.push(services[flag]);
								}

								if(data[i].SERVICE_COLORS !== null){
									$scope.overviewAppointment[i].service_colors.push(service_colors[flag]);
								}
								else{
									$scope.overviewAppointment[i].service_colors.push("#ffffff");
									$scope.overviewAppointment[i].services.push("");
								}
								if(patients[flag] !== 'No Patient'){
									var tempPatient = angular.element.parseJSON(patients[flag]);
									$scope.overviewAppointment[i].patients.push(tempPatient);
								}else{
									$scope.overviewAppointment[i].patients.push([{Patient_name: "No Patient", Patient_id: 0}]);
								}
							}else{
								$scope.overviewAppointment[i].doctors.push("");
								$scope.overviewAppointment[i].cals.push("");
								$scope.overviewAppointment[i].patients.push("");
								$scope.overviewAppointment[i].service_colors.push("");
								$scope.overviewAppointment[i].services.push("");
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

	// GO TO PATIENT
	$scope.goToPatientDetail = function(patient, data, index){
		//localStorageService.set("apptTempInfo", {'CAL_ID': data.cals[index]});
		//localStorageService.set("patientTempInfo", patient);
		$state.go("loggedIn.patient.appointment", {cal_id: data.cals[index], patient_id: patient.Patient_id});
	}
	// END GO TO PATIENT

	$scope.refreshAppointment = function(){
		loadAppointmentOverview($scope.modelObjectMap);
		$scope.modelObjectBookingMap = angular.copy($scope.modelObjectBooking);
		$scope.rightSelectedBooking = {};
	}

	/* BOOKING */
	$scope.bookingPatient = function(data, parentIndex, index){
		//EXTRA
		$scope.extra.service_id = data.services[index];
		//END EXTRA

		var bookingPopupId="#bookingModule";

		$scope.rightSelectedBooking.data = data;
		$scope.rightSelectedBooking.overId = parentIndex;
		$scope.rightSelectedBooking.docId = index;

		$scope.refreshPopup.booking = false;

		angular.element(bookingPopupId).fadeOut();
		angular.element(bookingPopupId).fadeIn();

		$scope.selectedCalId = data.cals[index];

		$scope.dataBooking = {
			CAL_ID: $scope.selectedCalId,
			DOCTOR: $scope.options.doctors[index],
			MAIN_INFO: $scope.modelObjectMap,
			patients: data.patients[index],
			FROM_TIME: data.from_time_map,
			TO_TIME: data.to_time_map
		}
		/*$scope.modelObjectMap.FROM_TIME = data.from_time_map;
		$scope.modelObjectMap.TO_TIME = data.to_time_map;		

		$cookieStore.put("patientBookingInfo", {
			cal_id: data.cals[index],
			data: $scope.modelObjectMap,

		});

		ReceptionistService.getById(data.cals[index]).then(function(response){
			if(response.Patient_id === null){
				$state.go("loggedIn.patient.booking");
			}else{
				localStorageService.set("apptTempInfo", {'CAL_ID': data.cals[index]});
				localStorageService.set("patientTempInfo", response);
				$state.go("loggedIn.doctor.patients.detail.appt");
			}
		})*/

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

	/*$scope.chooseBooking = function($event, options){
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
	}*/
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

	// ACTION RIGHT MENU
	$scope.showUnavailable = function(){
		if($scope.list_of_booking.length > 0){
			for(var i = 0; i < $scope.list_of_booking.length; i++){
				//angular.element($scope.list_of_booking[i].id).css("background", "rgb(61,74,83)");
				$scope.list_of_booking[i].isenable = false;
			}

			angular.element("#popupMenu").css("display", "none");
		}
	}
	// END ACTION RIGHT MENU
})