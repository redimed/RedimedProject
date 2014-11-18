angular.module("app.loggedIn.receptionist.appointment.doctor.controller", [])

.controller("ReceptionistAppointmentDoctorController", function($scope, $state, $cookieStore, localStorageService, DoctorService, PatientService, ReceptionistService, ConfigService){
	$scope.modelObjectMap = {};
	$scope.doctor = {};
	$scope.appointmentList = [];

	var init = function(){
		$scope.modelObjectMap = $cookieStore.get("appointmentDoctor");

		$scope.modelObjectMap.datepicker = new Date($scope.modelObjectMap.datepicker);

		DoctorService.getById($scope.modelObjectMap.doctor).then(function(doctor){
			$scope.doctor = doctor;

			loadAppointment($scope.modelObjectMap);
		})

		ConfigService.redimed_sites_option().then(function(list){
			$scope.options.redimedsites = list;
			$scope.modelObjectMap.site = parseInt(list[0].id);

			ConfigService.clinical_option().then(function(list){
				$scope.options.dept = list;
				$scope.modelObjectMap.dept = parseInt(list[0].CLINICAL_DEPT_ID);
			});
		});
	}

	var loadAppointment = function(options){
		var options_map = {
			datepicker_map: ConfigService.getCommonDate($scope.modelObjectMap.datepicker)
		};

		angular.extend(options_map, options);

		ReceptionistService.getAppointmentList(options_map).then(function(data){
			$scope.appointmentList = data;
			
			for(var i = 0; i < data.length; i++){
				$scope.appointmentList[i].from_time_map = ConfigService.convertToTimeString($scope.appointmentList[i].FROM_TIME);
				$scope.appointmentList[i].to_time_map = ConfigService.convertToTimeString($scope.appointmentList[i].TO_TIME);
			}
		});
	}

	$scope.refreshAppointment = function(){
		loadAppointment($scope.modelObjectMap);
	}

	init();

	/* BOOKING */
	$scope.bookingPatient = function(data){
		$cookieStore.put("patientBookingInfo", {
			cal_id: data.CAL_ID,
			data: $cookieStore.get("appointmentDoctor")
		});

		ReceptionistService.getById(data.CAL_ID).then(function(response){
			if(response.Patient_id === null){
				$state.go("loggedIn.patient.booking");
			}else{
				localStorageService.set("apptTempInfo", {'CAL_ID': data.CAL_ID});
				localStorageService.set("patientTempInfo", response);
				$state.go("loggedIn.doctor.patients.detail.appt");
			}
		})
	}
	/* END BOOKING */
})
