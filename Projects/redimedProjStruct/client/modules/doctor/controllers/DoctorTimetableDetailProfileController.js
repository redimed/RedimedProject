angular.module("app.loggedIn.doctor.timetable.detail.profile.controller",[])

.controller("DoctorTimetableDetailProfileController", function($scope, $stateParams, ConfigService, DoctorService){
	// LOAD OPTION
	var loadOption = function(){
		ConfigService.clinical_option().then(function(list){
			$scope.options.clinicals = list;
		})

		ConfigService.provider_type_option().then(function(list){
			$scope.options.providers = list.list;
		})
	}

	loadOption();
	// END LOAD OPTION

	// INIT
	$scope.doctor = {};
	var init = function () {
        DoctorService.getById($stateParams.doctorId).then(function(detail){
			$scope.doctor = detail;
		})
    }
    init();
	// END INIT
})