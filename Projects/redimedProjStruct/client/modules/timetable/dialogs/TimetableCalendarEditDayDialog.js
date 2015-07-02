angular.module('app.loggedIn.timetable')

.controller('TimetableCalendarEditDayDialog', function($scope, $cookieStore, $stateParams, $modalInstance, services, doctor, row, TimetableModel, ConfigService, toastr){
	var user_id = $cookieStore.get('userInfo').id;

	var day_of_week = [
		{value: 'Monday'},
		{value: 'Tuesday'},
		{value: 'Wednesday'},
		{value: 'Thursday'},
		{value: 'Friday'},
		{value: 'Saturday'}
	];

	var save = function(){
		ConfigService.beforeSave($scope.timetable.errors);
		$scope.timetable.errors = [];
		var postData = angular.copy($scope.timetable.form);

		postData.Last_update_date = moment().format('YYYY-MM-DD');
		postData.Created_by = postData.Last_updated_by = user_id;
		postData.isenable = 1;
		postData.from_time = ConfigService.convertToHHMM(postData.from_time);
		postData.to_time = ConfigService.convertToHHMM(postData.to_time);
		postData.from_date = ConfigService.convertToDB(postData.from_date);
		postData.to_date = ConfigService.convertToDB(postData.to_date);
		postData.doctor_id = $stateParams.doctorId;

		TimetableModel.edit(postData)
		.then(function(response){
			toastr.success('Edit Successfully');
			$modalInstance.close('success');
		}, function(error){
			$scope.timetable.errors = angular.copy(error.data.errors);
			ConfigService.beforeError($scope.timetable.errors);
		})
	}

	var load = function(){
		TimetableModel.one({cal_header_df_id: row.cal_header_df_id})
		.then(function(response){
			angular.extend($scope.timetable.form, response.data);

			$scope.timetable.form.from_date = ConfigService.convertToDate($scope.timetable.form.from_date);
			$scope.timetable.form.to_date = ConfigService.convertToDate($scope.timetable.form.to_date);

			$scope.timetable.form.from_time = ConfigService.convertHHMMToInt($scope.timetable.form.from_time);
			$scope.timetable.form.to_time = ConfigService.convertHHMMToInt($scope.timetable.form.to_time);

			delete $scope.timetable.form.Creation_date;
		}, function(error){})
	}

	$scope.timetable = {
		load: function(){ load(); },
		options: {
			DAY_OF_WEEK: day_of_week,
			services: services
		},
		form: {
			day_of_Week: '',
			service_id: null,
			from_time: '',
			to_time: '',
			from_date: null,
			to_date: null,
			description: '',
			appt_interval: doctor.Appt_interval
		},
		errors: [],
		save: function(){ save(); }
	}//end timetable

	//INIT
	$scope.timetable.load();
})