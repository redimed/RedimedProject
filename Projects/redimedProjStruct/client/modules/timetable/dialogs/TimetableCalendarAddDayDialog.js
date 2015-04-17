angular.module('app.loggedIn.timetable.dialogs.addDay', [])

.controller('TimetableCalendarAddDayDialog', function($scope, $cookieStore, $stateParams, $modalInstance, services, doctor, TimetableModel, ConfigService, toastr){
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

		postData.Creation_date = postData.Last_update_date = moment().format('YYYY-MM-DD');
		postData.Created_by = postData.Last_updated_by = user_id;
		postData.isenable = 1;
		postData.from_date = ConfigService.convertToDB(postData.from_date);
		postData.to_date = ConfigService.convertToDB(postData.to_date);
		postData.from_time = ConfigService.convertToHHMM(postData.from_time);
		postData.to_time = ConfigService.convertToHHMM(postData.to_time);
		postData.doctor_id = $stateParams.doctorId;

		TimetableModel.add(postData)
		.then(function(response){
			toastr.success('Added Successfully');
			$modalInstance.close('add');
		}, function(error){
			$scope.timetable.errors = angular.copy(error.data.errors);
			ConfigService.beforeError($scope.timetable.errors);
		})
	}

	$scope.timetable = {
		options: {
			DAY_OF_WEEK: day_of_week,
			services: services
		},
		form: {
			day_of_Week: '',
			SERVICE_ID: null,
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
})