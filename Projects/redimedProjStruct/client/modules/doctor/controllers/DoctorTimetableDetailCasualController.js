angular.module("app.loggedIn.doctor.timetable.detail.casual.controller",[])

.controller("DoctorTimetableDetailCasualController", function($scope, $stateParams, DoctorService, ConfigService, REAL_DAY_OF_WEEK, toastr){
	var from_time = new Date();
	var to_time = new Date();
	var doctor_id = $stateParams.doctorId;

	to_time.setDate(from_time.getDate()+7);

	$scope.modelObjectMap = {
		'from_time': ConfigService.convertToDate(from_time),
		'to_time': ConfigService.convertToDate(from_time),
		'doctor_id': doctor_id
	}

	$scope.changeTime = function(){
		init();
	}

	$scope.changeCalendar = function(options){
		var data = {
			'FROM_TIME': options.data.from_time_map,
			'TO_TIME': options.data.from_time_map,
			'SITE_ID': options.data.SITE_ID,
			'DOCTOR_ID': $stateParams.doctorId,
			'CAL_ID': options.data.CAL_ID
		}

		DoctorService.changeCasual(data).then(function(response){
			if(response.status === 'success'){
				toastr.success('Updated succesfully', "Success");
				init();
			}
		})
	}

	//CONFIG
	$scope.options = {
       	sites_option: []
    }

    var loadConfig = function(){
    	ConfigService.redimed_sites_option().then(function(list){
			$scope.options.sites_option = list;
		});
    }

    loadConfig();
	//END CONFIG

	// LOAD CASUAL CALENDAR
	$scope.casual_list = [];
	$scope.real_list = [];
	var init = function(){
		$scope.casual_list = [];
		$scope.real_list = [];

		DoctorService.getCasualCalendar($scope.modelObjectMap).then(function(data){
			if(data){
				$scope.casual_list = data.data;

				for(var i = 0; i < $scope.casual_list.length; i++){
					$scope.casual_list[i].from_time_map = ConfigService.convertToTimeStringApp($scope.casual_list[i].FROM_TIME);
					$scope.casual_list[i].to_time_map = ConfigService.convertToTimeStringApp($scope.casual_list[i].TO_TIME);

					$scope.casual_list[i].day_of_week = REAL_DAY_OF_WEEK[ConfigService.getDayFromTime($scope.casual_list[i].FROM_TIME)];
					$scope.casual_list[i].week = ConfigService.getWeekFromDate($scope.casual_list[i].FROM_TIME);
					$scope.casual_list[i].convert_date = ConfigService.convertToDate($scope.casual_list[i].FROM_TIME);

					var id = $scope.casual_list[i].day_of_week+"-"+$scope.casual_list[i].week+"-"+$scope.casual_list[i].convert_date;

					$scope.real_list.push({'id': id, day_of_week: $scope.casual_list[i].day_of_week, week: $scope.casual_list[i].week, convert_date: $scope.casual_list[i].convert_date});
				} // end for

				if($scope.real_list.length > 0){
					$scope.real_list_map = [];
					$scope.real_list_map.push($scope.real_list[0]);
					$scope.real_list_map[0].items = [];
					var index = 0;
					for(var i = 0; i < $scope.real_list.length; i++){
						if($scope.real_list_map[index].id !== $scope.real_list[i].id){
							$scope.real_list_map.push($scope.real_list[i]);
							index++;
							$scope.real_list_map[index].items = [];
						}
					}// end for

					for(var i = 0; i < $scope.casual_list.length; i++){
						for(var j = 0; j < $scope.real_list_map.length; j++){
							if($scope.real_list_map[j].day_of_week === $scope.casual_list[i].day_of_week
								&& $scope.real_list_map[j].week === $scope.casual_list[i].week
								&& $scope.real_list_map[j].convert_date === $scope.casual_list[i].convert_date){
								$scope.real_list_map[j].items.push($scope.casual_list[i]);
								break;
							}
						}
					}// end for
				} // end if real_list

				console.log($scope.real_list_map);
			} // end if
		})
	}

	init();
	// END LOAD CASUAL CALENDAR
})