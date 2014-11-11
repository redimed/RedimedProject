angular.module("app.loggedIn.doctor.add.controller",[])

.controller("DoctorAddController", function($scope, $state, $cookieStore, $stateParams, toastr, ConfigService, DoctorService){
	// LOAD OPTION
	$scope.newId = 0;

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

	// INIT
	$scope.modelObjectMap = {};
	var init = function () {
		$scope.modelObjectMap = angular.copy($scope.modelDoctorObject);

		$scope.modelObjectMap.Created_by = $cookieStore.get("userInfo").id;

		DoctorService.getMaxId().then(function(data){
			$scope.newId = data.data.doctor_id+1;

			$scope.modelObjectMap.doctor_id = $scope.newId;
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
					$scope.label_step = 'Insert';
				}
				break;
			case 2:
				if(!$scope.mainForm.$invalid){
					$scope.isSubmit = false;
					
					DoctorService.insert($scope.modelObjectMap).then(function(response){
						if(response.status === 'success'){
							toastr.success("Insert Successfully", "Success");
							$scope.step = 1;
							$scope.label_step = "Next";
							init();
							$state.go("loggedIn.doctor.timetable.detail.profile", {'doctorId': $scope.newId});
						}
					})
				}
				break;
		}
	}
	// END STEP
})