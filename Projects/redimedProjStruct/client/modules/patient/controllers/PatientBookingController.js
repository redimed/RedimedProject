angular.module("app.loggedIn.patient.booking.controller", [])

.controller("PatientBookingController", function($scope, $state, $cookieStore, ReceptionistService, ConfigService, PatientService, toastr){
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
	            $scope.modelObjectBookingMap.SERVICE_ID = list[0].SERVICE_ID;
	            $scope.modelObjectBookingMap.ACC_TYPE = $scope.options.acc_types[0].code;
	            $scope.modelObjectBookingMap.APP_TYPE = $scope.options.app_types[0].code;
	            $scope.modelObjectBookingMap.bill_to = "1";
	            $scope.modelObjectBookingMap.ARR_TIME = "00:00";
	            $scope.modelObjectBookingMap.ATTEND_TIME = "00:00";
	        })
		})
	}

    init();
	// END INIT

	// ACTIVE
	$scope.getActive = function(state){
		if(state === $state.current.name){
			return 'active';
		}else{
			return '';
		}
	}
	// END ACTIVE

	// STEP
	$scope.step = 1;
	$scope.label_step = 'Next';

	$scope.prevStep = function(){
		if($scope.step > 1){
			$scope.label_step = "Next";
			$scope.step--;
		}
	}

	$scope.nextStep = function(){
		switch($scope.step){
			case 1:
				$scope.step = 2;
				$scope.label_step = '';
				break;
			case 2:
				$state.go("loggedIn.patient.booking.search");
				/*if(!$scope.mainForm.$invalid){
					$scope.isSubmit = false;
					
					DoctorService.update($scope.modelObjectMap).then(function(response){
						if(response.status === 'success'){
							toastr.success("Updated Successfully", "Success");
							$scope.step = 1;
							$scope.label_step = "Next";
							init();
						}
					})
				}*/
				break;
		}
	}
	// END STEP

	/* SEARCH */
    $scope.list = [];
    $scope.loadList = function () {
        PatientService.getByOption({search: $scope.search}).then(function (data) {
            for (var i = 0, len = data.list.length; i < len; ++i) {
                if (data.list[i].DOB)
                    data.list[i].DOB = ConfigService.getCommonDate(data.list[i].DOB);
            }
            $scope.list.results = data.list;
        });
    };

    var initSearch = function () {
        $scope.search = angular.copy($scope.searchObject);

        $scope.sexIndex = [{code: 'Female'}, {code: 'Male'}];

        $scope.pagingIndex = [{code: 5}, {code: 10}, {code: 20}, {code: 50}];

        $scope.loadList();

        PatientService.getTotals().then(function (data) {
            $scope.list.count = data.count;
        });
    }

    initSearch();
    $scope.setPage = function () {
        $scope.search.offset = ($scope.search.currentPage - 1) * $scope.search.limit;
        $scope.loadList();
    }

    $scope.goToBooking = function(list){
        $scope.modelObjectBookingMap.Patient_id = list.Patient_id;

        ReceptionistService.booking($scope.modelObjectBookingMap).then(function(data){
            $state.go("loggedIn.receptionist.appointment");
        })
    }
    /* END SEARCH */

	// INSERT MODULE
	// STEP
	var init = function(){
		$scope.modelObjectMap = angular.copy($scope.modelObject);
	}

	init();

    $scope.insert_step = 1;
    $scope.isSubmit = false;

    var reset = function(){
        $scope.insert_step = 1;
        $scope.modelObjectMap = angular.copy($scope.modelObject);
    }

    $scope.insertNextStep = function(form){
        $scope.isSubmit = true;

        switch($scope.insert_step){
            case 1:
                if(form.$invalid){
                    toastr.error("You got errors to fix", "Error");
                }else{
                    $scope.insert_step++;
                    $scope.isSubmit = false;
                }
                break;
            case 2:
                if(form.$invalid){
                    toastr.error("You got errors to fix", "Error");
                }else{
                    $scope.insert_step++;
                    $scope.isSubmit = false;
                }
                break;
            case 3:
                if(form.$invalid){
                    toastr.error("You got errors to fix", "Error");
                }else{
                    // DATE
                    $scope.modelObjectMap.DOB = ConfigService.getCommonDateDatabase($scope.modelObjectMap.DOB);
                    $scope.modelObjectMap.Exp_medicare = ConfigService.getCommonDateDatabase($scope.modelObjectMap.Exp_medicare);
                    $scope.modelObjectMap.Exp_pension = ConfigService.getCommonDateDatabase($scope.modelObjectMap.Exp_pension);
                    // END DATE

                    PatientService.insertPatient({patient: $scope.modelObjectMap}).then(function (data) {
                        if (data.status != 'success') {
                            toastr.error("Cannot Insert!", "Error");
                            return;
                        }
                        reset();
                        $scope.modelObjectBookingMap.Patient_id = data.data.Patient_id;

                        ReceptionistService.booking($scope.modelObjectBookingMap).then(function(data){
                            $state.go("loggedIn.receptionist.appointment");
                        })
                        toastr.success('Insert Successfully !!!', "Success");
                    })
                    $scope.isSubmit = false;
                }
                break;
        }
    }

    $scope.insertBackStep = function(){
        if($scope.insert_step > 1){
            $scope.insert_step--;
        }
    }
    // END STEP
	// END INSERT MODULE
})
