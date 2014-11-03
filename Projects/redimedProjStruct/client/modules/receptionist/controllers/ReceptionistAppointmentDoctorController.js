angular.module("app.loggedIn.receptionist.appointment.doctor.controller", [])

.controller("ReceptionistAppointmentDoctorController", function($scope, $modal, $cookieStore, DoctorService, PatientService, ReceptionistService, ConfigService){
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
		var modalTemp = {
			templateUrl: "modules/patient/views/popup/action.html",
			controller: "PatientActionController",
		}

		console.log(data);

		var modalInstance = $modal.open({
			templateUrl: modalTemp.templateUrl,
			size: "lg",
			controller: modalTemp.controller,
			resolve: {
		        items: function () {
		        	return {cal_id: data.CAL_ID, bookingObject: data, data: data, options: $scope.options};
		        }
		    }
		});

		modalInstance.result.then(function(data){
			$scope.refreshAppointment();
		});
	}
	/* END BOOKING */
})