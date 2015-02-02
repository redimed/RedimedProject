angular.module("app.loggedIn.doctor.timetable.detail.casual.controller",[])

.controller("DoctorTimetableDetailCasualController", function($scope, $stateParams, 
	DoctorService, ConfigService, mdtDoctorService, mdtTimetableService, sysServiceService, REAL_DAY_OF_WEEK, toastr){

	var doctor_id = $stateParams.doctorId;
	var from_time = null;

	$scope.objectMap = {};
	$scope.objectMap.from_time = ConfigService.convertToDate(new Date());

	console.log($scope.options)

	$scope.timetable = {
		add: function(item){

			if(item.list[0] && item.list[0].CAL_ID === null) {
				return;
			}

			var object = {
				CAL_ID: null,
				SITE_ID: 1,
				DOCTOR_ID: doctor_id,
				FROM_TIME: "00:00",
				TO_TIME: "00:00",
				SERVICE_ID: 1
			};

			item.list.unshift(object);
		},
		addRowData: function(item, cal){
			var from_time = ConfigService.getCommonDateDatabase(item.DATE)+" "+ cal.FROM_TIME +":00";
			var to_time = ConfigService.getCommonDateDatabase(item.DATE)+ " "+ cal.TO_TIME+":00";

			var options = {
				FROM_TIME: from_time,
				TO_TIME: to_time,
				SITE_ID: cal.SITE_ID,
				DOCTOR_ID: $stateParams.doctorId,
				CLINICAL_DEPT_ID: $scope.doctor.CLINICAL_DEPT_ID,
				SERVICE_ID: cal.SERVICE_ID
			}

			DoctorService.addCalendar(options).then(function(response){
				toastr.success('Add successfully !!!');
				cal.CAL_ID = response.data.CAL_ID;
			})
		},
		updateRow: function(item, cal) {
			var from_time = ConfigService.getCommonDateDatabase(item.DATE)+" "+ cal.FROM_TIME +":00";
			var to_time = ConfigService.getCommonDateDatabase(item.DATE)+ " "+ cal.TO_TIME+":00";

			var options = {
				FROM_TIME: from_time,
				TO_TIME: to_time,
				SITE_ID: cal.SITE_ID,
				SERVICE_ID: cal.SERVICE_ID
			}

			DoctorService.editCalendar(cal.CAL_ID, options).then(function(response){
				console.log(response)
			});
		},
		remove: function(options){
			if(options.cal.CAL_ID === null){
				$scope.data[options.parentIndex].list.splice(options.index, 1);
			}else{
				mdtTimetableService.remove(options.cal.CAL_ID).then(function(list){
					$scope.data[options.parentIndex].list.splice(options.index, 1);
				})
			}
		},
		removeAllDay : function(item){
			var str_date = ConfigService.getCommonDateDatabase(item.DATE);

			var conf = confirm('Delete all calendar on this day : ' + item.DATE);

			if(!conf) return;
			DoctorService.deleteDateCalendar(doctor_id, str_date).then(function(response){
				console.log(response)
				item.list = [];
			});
		}
	}


	$scope.getAppointments  = function() {	
		toastr.info('Loading data from server');
		var str_from_time = ConfigService.getCommonDateDatabase($scope.objectMap.from_time);
		var get_date = new Date(str_from_time);

		console.log('LOAD TIME ', Date.now())
		DoctorService.overviewCalendar(doctor_id, str_from_time)
		.then(function(response){
			var cal_list = response.data;
			for(var i = 0; i < cal_list.length; ++i) {
				console.log(i)
				var item = cal_list[i];
				var run_date = new Date(get_date);
				run_date.setDate(get_date.getDate() + i);
				var str_date = ConfigService.convertToDate(run_date);
				if(str_date != item.DATE) {
					cal_list.splice(i, 0, {DATE: str_date, list: []});
				}
			}
		//	$scope.data = cal_list.slice(0, 5);
			console.log('LOADed TIME ', Date.now())
		});
	}
	
	$scope.getAppointments();
		

	$scope.doctor = {};
	mdtDoctorService.byId($stateParams.doctorId).then(function(response){
		$scope.doctor = response.data;
		sysServiceService.byClinicalDepartment(response.data.CLINICAL_DEPT_ID).then(function(response){
			$scope.options.clinical_depts = response.data;
		})
	})
});	

