angular.module("app.loggedIn.doctor.timetable.detail.casual.controller",[])

.controller("DoctorTimetableDetailCasualController", function($scope, $stateParams, DoctorService, ConfigService, REAL_DAY_OF_WEEK){
	var from_time = new Date();
	var to_time = new Date();
	var doctor_id = $stateParams.doctorId;

	to_time.setDate(from_time.getDate()+7);

	$scope.modelObjectMap = {
		'from_time': ConfigService.convertToDate(from_time),
		'to_time': ConfigService.convertToDate(to_time),
		'doctor_id': doctor_id
	}

	// LOAD CASUAL CALENDAR
	$scope.casual_list = [];
	$scope.real_list = [];
	var init = function(){
		DoctorService.getCasualCalendar($scope.modelObjectMap).then(function(data){
			$scope.casual_list = data.data;

			for(var i = 0; i < $scope.casual_list.length; i++){
				$scope.casual_list[i].from_time_map = ConfigService.convertToTimeString($scope.casual_list[i].FROM_TIME);
				$scope.casual_list[i].to_time_map = ConfigService.convertToTimeString($scope.casual_list[i].TO_TIME);

				$scope.casual_list[i].day_of_week = REAL_DAY_OF_WEEK[ConfigService.getDayFromTime($scope.casual_list[i].FROM_TIME)];
				$scope.casual_list[i].week = ConfigService.getWeekFromDate($scope.casual_list[i].FROM_TIME);
				$scope.casual_list[i].convert_date = ConfigService.convertToDate($scope.casual_list[i].FROM_TIME);

				var temp_list = {'week': $scope.casual_list[i].week, 'date': $scope.casual_list[i].convert_date, 'day': $scope.casual_list[i].day_of_week};

				if($scope.real_list.length === 0)
					$scope.real_list.push(temp_list);
				else{
					var flag = -1;
					for(var j = 0; j < $scope.real_list.length; j++){
						if(JSON.stringify($scope.real_list[j]) === JSON.stringify(temp_list)){
							flag = j;
							break;
						}
					}

					if(flag === -1)
						$scope.real_list.push(temp_list);
					else{
						//$scope.real_list[flag].push({'FROM_TIME': $scope.casual_list[i].from_time_map, 'TO_TIME': $scope.casual_list[i].to_time_map, 'SITE': $scope.casual_list[i].SITE_ID});
					}
				} // END ELSE
			} //end for

			//console.log($scope.real_list);
		})
	}

	init();
	// END LOAD CASUAL CALENDAR
})