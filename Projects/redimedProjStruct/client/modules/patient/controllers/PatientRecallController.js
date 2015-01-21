angular.module("app.loggedIn.patient.recall.controller", [])
.controller("PatientRecallController", function($scope, $state, $filter, toastr, $stateParams, DoctorService, PatientService, ReceptionistService, ConfigService){
	zzz = $scope;
	var patient_id = $stateParams.patient_id;
    var cal_id = $stateParams.cal_id;

    var arrGetBy = $filter('arrGetBy');

    var get_list_services = function(){
		ConfigService.system_service_by_clinical($scope.modelObjectMap.dept)
		.then(function(response){
			$scope.opt_services = response;
			if($scope.opt_services.length > 0) {
				$scope.modelObjectMap.service = $scope.opt_services[0].SERVICE_ID;
			}
		});
	}



    /*
    *	 GET LIST RECALL APPOINTMENTS
    */
    var getRecallAppt = function(){
    	PatientService.getRecallAppointments(patient_id)
		.then(function(response){
			$scope.appt_list = response.data;
			angular.forEach($scope.appt_list, function(item){
				item.appointment.FROM_TIME = ConfigService.getCommonDatetime(item.appointment.FROM_TIME);
			});
		})
    }
	getRecallAppt();

	/*
    *	 GET PATIENT DETAIL
    */
	PatientService.get(patient_id).then(function(response){
    	if(response.status == 'success') {
    		$scope.patient  = response.data;
    		$scope.patient.Patient_name = $scope.patient.First_name + ' ' + $scope.patient.Sur_name;
    	}
    })

	/*
	*	GET APPT DETAIL
	*/
    ReceptionistService.apptDetail(cal_id)
    .then(function(response){
        if(response.status === 'success') {
            delete response.data.Patient_id;
            angular.extend($scope.appointment, response.data);

            $scope.modelObjectMap.site = $scope.appointment.SITE_ID;
            $scope.modelObjectMap.dept = $scope.appointment.CLINICAL_DEPT_ID;

            $scope.refreshAppointment();
           	get_list_services();
        }

        return PatientService.getApptClaim(patient_id, cal_id);
    })
	.then(function(response){
		console.log(response.data)
		if(response.status === 'success' && response.data.length > 0) {
			$scope.appointment.Claim_id = response.data[0].Claim_id;
		}

		console.log($scope.appointment)
	});

	$scope.formRecall = {
		is_show: false,
		open: function(){
			this.is_show = true;
		},
		close: function() {
			this.is_show = false;
		}
	}

	/*
	*	MAKE A RECALL 
	*/
	$scope.appointment = {};
	$scope.modelObjectMap = {site: 1, service: '' };
	$scope.modelObjectMap.datepicker = new Date();

    $scope.refreshAppointment = function(type) {
    	if(type && type == 'department') {
    		get_list_services();
    	}

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

    $scope.bookingPatient = function(data, calIndex, doctorIndex) {
    	console.log(data)
    	var cal_id = data.cals[doctorIndex];
    	var doctor_id = data.doctors[doctorIndex];

    	if(!cal_id) {
    		toastr.error('Cannot recall this !!! ', 'Error');
    		return;
    	}

    	var yes = confirm('Do you want to recall at ' + data.from_time_map 
    			+ ' ' + ConfigService.getCommonDatetime($scope.modelObjectMap.datepicker)
    			+ ' with ' + $scope.options.doctors[doctorIndex].NAME
    		);

    	if(!yes) {
    		return;
    	}

    	var patients = data.patients[doctorIndex];
    	var p = {
    		Patient_id: $scope.patient.Patient_id,
    		Patient_name: $scope.patient.Patient_name
    	};

    	if(patients == '') {
    		patients = [];
    	}
    	if( patients.length == 0 || patients[0].Patient_id == 0 ) {
    		patients[0] = p;
    	} else {
    		// check patient
    		var t_item = arrGetBy(patients, 'Patient_id', p.Patient_id);
    		if(t_item) {
    			toastr.error('Cannot Recall again !!!', 'Error')
    			return;
    		}
    		patients.push(p);
    	}
	   	var str_patients = JSON.stringify(patients) ;
    	var optionMap = {
    		CAL_ID: cal_id,
    		SERVICE_ID: $scope.modelObjectMap.service,
    		Patient_id: patient_id,
    		PATIENTS: str_patients
    	};

    	console.log(optionMap);
    	ReceptionistService.booking(optionMap).then(function(response){
    		if(response.status === 'success') {
    			toastr.success('Recall Successful !!!', 'Success')

    			$scope.formRecall.close();

    			if($scope.appointment.Claim_id) {
    				var item = {
    					Claim_id: $scope.appointment.Claim_id,
    					CAL_ID: cal_id,
    					Patient_id: patient_id
    				}
    				PatientService.insertApptClaim(item)
    				.then(function(response){
    					console.log(response)
    					if(response.status === 'success') {

    					}
    				})

    			}

    			// PatientService.insertClaim
    			getRecallAppt();
    		}
    	});
    }
    

});