angular.module("app.loggedIn.doctor.timetable.detail.controller",[
	"app.loggedIn.doctor.timetable.detail.calendar.controller",
	"app.loggedIn.doctor.timetable.detail.profile.controller",
	"app.loggedIn.doctor.timetable.detail.casual.controller"
])

.controller("DoctorTimetableDetailController", function($scope, $state, $stateParams, DoctorService, ConfigService){
	//LOAD DETAIL
	$scope.modelDetail = {};

	var loadDetail = function(){
		DoctorService.getById($stateParams.doctorId).then(function(detail){
			$scope.modelDetail = detail;
		})
	}

	loadDetail();
	//END LOAD DETAIL

	// ACTIVE
	$scope.getActive = function(state){
		if(state === $state.current.name){
			return 'active';
		}else{
			return '';
		}
	}
	// END ACTIVE
})