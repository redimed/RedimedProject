angular.module("app.loggedIn.doctor.timetable.detail.casual.controller",[])

.controller("DoctorTimetableDetailCasualController", function($scope, $stateParams, DoctorService, ConfigService, mdtDoctorService, mdtTimetableService, sysServiceService, REAL_DAY_OF_WEEK, toastr){
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
		$scope.real_list_map = [];
		init();
	}

	$scope.changeCalendar = function(options){

		var from_time = ConfigService.getCommonDateDatabase($scope.modelObjectMap.from_time)+" "+options.data.from_time_map+":00";
		var to_time = ConfigService.getCommonDateDatabase($scope.modelObjectMap.to_time)+" "+options.data.to_time_map+":00";

		if(options.data.CAL_ID !== null){
			var data = {
				'FROM_TIME': from_time,
				'TO_TIME': to_time,
				'SITE_ID': options.data.SITE_ID,
				'DOCTOR_ID': $stateParams.doctorId,
				'CAL_ID': options.data.CAL_ID,
				'SERVICE_ID': options.data.SERVICE_ID
			}

			DoctorService.changeCasual(data).then(function(response){
				if(response.status === 'success'){
					toastr.success('Updated succesfully', "Success");
					init();
				}
			})
		}
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

	$scope.timetable = {
		add: function($index){
			var object = {
				CAL_ID: null,
				SITE_ID: 1,
				DOCTOR_ID: $stateParams.doctorId,
				from_time_map: "00:00",
				to_time_map: "00:00",
				SERVICE_ID: 1
			};

			$scope.real_list_map[$index].items.unshift(object);
		},
		addRowData: function(list){
			var from_time = ConfigService.getCommonDateDatabase($scope.modelObjectMap.from_time)+" "+list.from_time_map+":00";
			var to_time = ConfigService.getCommonDateDatabase($scope.modelObjectMap.to_time)+" "+list.to_time_map+":00";

			var options = {
				FROM_TIME: from_time,
				TO_TIME: to_time,
				SITE_ID: list.SITE_ID,
				DOCTOR_ID: $stateParams.doctorId,
				CLINICAL_DEPT_ID: $scope.doctor.CLINICAL_DEPT_ID,
				SERVICE_ID: list.SERVICE_ID
			}

			mdtTimetableService.addRow(options).then(function(response){
				init();
			})
		},
		remove: function(options){
			if(options.list.CAL_ID === null){
				$scope.real_list_map[options.parentIndex].items.splice(options.index, 1);
			}else{
				mdtTimetableService.remove(options.list.CAL_ID).then(function(list){
					init();
				})
			}
		}
	}

	// LOAD CASUAL CALENDAR
	$scope.casual_list = [];
	$scope.real_list = [];
	var init = function(){
		$scope.casual_list = [];
		$scope.real_list = [];

		DoctorService.getCasualCalendar($scope.modelObjectMap).then(function(data){
			if(data){
				console.log('CASUAL LIST', data.data)
				$scope.casual_list = data.data;

				var i = 0;
				_.forEach($scope.casual_list, function(casual){
					$scope.casual_list[i].from_time_map = ConfigService.convertToTimeStringApp($scope.casual_list[i].FROM_TIME);
					$scope.casual_list[i].to_time_map = ConfigService.convertToTimeStringApp($scope.casual_list[i].TO_TIME);

					$scope.casual_list[i].day_of_week = REAL_DAY_OF_WEEK[ConfigService.getDayFromTime($scope.casual_list[i].FROM_TIME)];
					$scope.casual_list[i].week = ConfigService.getWeekFromDate($scope.casual_list[i].FROM_TIME);
					$scope.casual_list[i].convert_date = ConfigService.convertToDate($scope.casual_list[i].FROM_TIME);

					var id = $scope.casual_list[i].day_of_week+"-"+$scope.casual_list[i].week+"-"+$scope.casual_list[i].convert_date;

					$scope.real_list.push({'id': id, day_of_week: $scope.casual_list[i].day_of_week, week: $scope.casual_list[i].week, convert_date: $scope.casual_list[i].convert_date});
					i++;
				})

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
			} // end if
		})
	}

	init();

	$scope.doctor = {};

	mdtDoctorService.byId($stateParams.doctorId).then(function(response){
		$scope.doctor = response.data;
		sysServiceService.byClinicalDepartment(response.data.CLINICAL_DEPT_ID).then(function(response){
			$scope.options.clinical_depts = response.data;
		})
	})
	// END LOAD CASUAL CALENDAR
})