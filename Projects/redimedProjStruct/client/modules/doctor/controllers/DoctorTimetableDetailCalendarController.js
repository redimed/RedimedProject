angular.module("app.loggedIn.doctor.timetable.detail.calendar.controller",[])

.controller("DoctorTimetableDetailCalendarController", function($scope, $state, $stateParams, toastr, DoctorService, ConfigService){
	$scope.doctor_id = $stateParams.doctorId;


	//LOAD DETAIL
	$scope.modelDetail = {};

	var loadDetail = function(){
		DoctorService.getById($stateParams.doctorId).then(function(detail){
			$scope.modelDetail = detail;
		})
	}

	loadDetail();
	//END LOAD DETAIL

	//Load Timetable
	$scope.timetable = [];
	$scope.timetable_map = [];
	$scope.selectedTimetable = {};

	var loadTimetable = function(){
		DoctorService.timetable($stateParams.doctorId).then(function(list){
			$scope.timetable_map = list;

			for(var i = 0; i < $scope.timetable_map.length; i++){
				$scope.timetable_map[i].from_time_map = ConfigService.convertToTimeString(list[i].from_time);
				$scope.timetable_map[i].to_time_map = ConfigService.convertToTimeString(list[i].to_time);
				$scope.timetable_map[i].is_add = false;
			}

			$scope.timetable = angular.copy($scope.timetable_map);
		})
	}

	loadTimetable();
	//END LOAD TIMETABLE

	//GO TO TIMETABLE WEEK
	$scope.timetable_week = [];
	$scope.showWeekTimetable = function(data){
		$scope.selectedTimetable = data;
		DoctorService.timetableWeekById(data).then(function(list){
			$scope.timetable_week = list;
			for(var i = 0; i < $scope.timetable_week.length; i++){
				$scope.timetable_week[i].is_add = false;
			}
		});
	}
	//END GO TO TIMETABLE WEEK

	//CONFIG
	/*$scope.options = {
        day_of_week_option: ConfigService.day_of_week_option(),
        number_of_week_option: ConfigService.number_of_week_option(),
       	sites_option: []
    }*/

    var loadConfig = function(){
    	ConfigService.redimed_sites_option().then(function(list){
			$scope.options.sites_option = list;
		});
    }

    //loadConfig();
	//END CONFIG

	// ACTION
	$scope.reset = function(){
		$scope.timetable = angular.copy($scope.timetable_map);
	}

	$scope.addNew = function(type){
		if(type === 'week'){
			$scope.timetable_week.push({'cal_header_df_id': $scope.selectedTimetable.cal_header_df_id, 'doctor_id': $scope.selectedTimetable.doctor_id, 'site_id': 1, 'description':'', 'isenable':1, 'is_add':true, 'week_ord_of_month':1 });
		}else if(type === 'timetable'){
			$scope.timetable.push({'cal_header_df_id': 0, 'doctor_id': $stateParams.doctorId, 'day_of_Week': 'Monday', 'from_time_map': '00:00', 'to_time_map':'00:00', 'description':'', 
				'isenable':1, 'is_add':true });
		}
	}

	$scope.cancelSave = function(type, index){
		if(type === 'timetable'){
			$scope.timetable.splice(index, 1);
		}else{
			$scope.timetable_week.splice(index, 1);
		}
	}

	$scope.save = function(type, data){
		if(type === 'timetable'){
			DoctorService.insertTimetable({'data':data}).then(function(data){
				if(data.status === 'OK'){
					$state.go("loggedIn.doctor.timetable.detail.calendar", {doctorId:$stateParams.doctorId}, {reload: true});
					toastr.success("Insert Successfully", "Success");
				}	
			})
		}else{
			DoctorService.insertTimetableWeek({'data':data}).then(function(data){
				if(data.status === 'OK'){
					$state.go("loggedIn.doctor.timetable.detail.calendar", {doctorId:$stateParams.doctorId}, {reload: true});
					toastr.success("Insert Successfully", "Success");
				}
			})
		}
	}

	$scope.changeTimetable = function(type, data){
		if(type === 'timetable'){
			if(!data.is_add){
				DoctorService.changeTimetable({'data':data}).then(function(data){
					if(data.status === 'OK'){
						$state.go("loggedIn.doctor.timetable.detail.calendar", {doctorId:$stateParams.doctorId}, {reload: true});
						toastr.success("Change Successfully", "Success");
					}
				})
			}
		}else{
			if(!data.is_add){
				DoctorService.changeTimetableWeek({'data':data}).then(function(data){
					if(data.status === 'OK'){
						$state.go("loggedIn.doctor.timetable.detail.calendar", {doctorId:$stateParams.doctorId}, {reload: true});
						toastr.success("Change Successfully", "Success");
					}	
				})
			}
		}
	}

	$scope.removeTimetable = function(type, data){
		if(type === 'timetable'){
			DoctorService.removeTimetable({'data':data}).then(function(data){
				if(data.status === 'OK'){
					$state.go("loggedIn.doctor.timetable.detail.calendar", {doctorId:$stateParams.doctorId}, {reload: true});
					toastr.success("Remove Successfully", "Success");
				}
			});
		}else{
			DoctorService.removeTimetableWeek({'data':data}).then(function(data){
				if(data.status === 'OK'){
					$state.go("loggedIn.doctor.timetable.detail.calendar", {doctorId:$stateParams.doctorId}, {reload: true});
					toastr.success("Remove Successfully", "Success");
				}
			});
		}
	}

	$scope.generate = function(){
		DoctorService.generateTimetable({'timetable': $scope.timetable_map, 'interval': $scope.modelDetail.Appt_interval, 'clinical_id': $scope.modelDetail.CLINICAL_DEPT_ID}).then(function(response){
			if(response.status == 'OK'){
				toastr.success("Generate Success", "success");
			}
		})
	}
	// END ACTION
})