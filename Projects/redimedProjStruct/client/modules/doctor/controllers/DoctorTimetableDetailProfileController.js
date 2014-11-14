angular.module("app.loggedIn.doctor.timetable.detail.profile.controller",[])

.controller("DoctorTimetableDetailProfileController", function($scope, $stateParams, toastr, ConfigService, DoctorService, PatientService){
	// LOAD OPTION
	var loadOption = function(){
		ConfigService.clinical_option().then(function(list){
			$scope.options.clinicals = list;
		})

		ConfigService.provider_type_option().then(function(list){
			$scope.options.providers = list.list;
		})

		ConfigService.qualification_option().then(function(list){
			$scope.options.qualifications = list.list;
		})

		ConfigService.account_type_option().then(function(list){
			$scope.options.account_types = list.list;
		})
	}

	loadOption();
	// END LOAD OPTION

	$scope.getImage = function(image){
		PatientService.getSkinApp(image).then(function(response){
			
		})
	}

	// INIT
	$scope.modelObjectMap = {};
	var sign_map = "";
	var init = function () {
		$scope.modelObjectMap = angular.copy($scope.modelDoctorObject);

        DoctorService.getById($stateParams.doctorId).then(function(detail){
        	angular.extend($scope.modelObjectMap, detail);

        	// KEEP SIGN
        	sign_map = $scope.modelObjectMap.Signature;
        	// END KEEP SIGN

        	if($scope.modelObjectMap.isReceiveEmailAfterHour)
        		$scope.modelObjectMap.isReceiveEmailAfterHour = $scope.modelObjectMap.isReceiveEmailAfterHour.toString();
        	if($scope.modelObjectMap.isAppointmentBook)
        		$scope.modelObjectMap.isAppointmentBook = $scope.modelObjectMap.isAppointmentBook.toString();
        	if($scope.modelObjectMap.isNewCalendarSlot)
        		$scope.modelObjectMap.isNewCalendarSlot = $scope.modelObjectMap.isNewCalendarSlot.toString();
        	if($scope.modelObjectMap.Isenable)
        		$scope.modelObjectMap.Isenable = $scope.modelObjectMap.Isenable.toString();
		})
    }
    init();
	// END INIT

	// STEP
	$scope.isSubmit = false;
	$scope.step = 1;
	$scope.label_step = 'Next';

	$scope.prevStep = function(){
		if($scope.step > 1){
			$scope.label_step = "Next";
			$scope.step--;
		}
	}

	$scope.nextStep = function(){
		$scope.isSubmit = true;
		switch($scope.step){
			case 1:
				if(!$scope.mainForm.$invalid){
					$scope.isSubmit = false;
					$scope.step = 2;
					$scope.label_step = 'Update';
				}
				break;
			case 2:
				if(!$scope.mainForm.$invalid){
					$scope.isSubmit = false;
					
					DoctorService.update($scope.modelObjectMap).then(function(response){
						if(response.status === 'success'){
							toastr.success("Updated Successfully", "Success");
							$scope.step = 1;
							$scope.label_step = "Next";
							init();
						}
					})
				}
				break;
		}
	}
	// END STEP

	// UDPATE SIGNATURE
	$scope.resetSignature = function(){
		$scope.modelObjectMap.Signature = sign_map;
	}

	$scope.clearSignature = function(){
		$scope.modelObjectMap.Signature = "";
	}
	// END UPDATE SIGNATURE
})
