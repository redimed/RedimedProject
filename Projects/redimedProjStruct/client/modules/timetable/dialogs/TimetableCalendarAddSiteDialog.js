angular.module('app.loggedIn.timetable')

.controller('TimetableCalendarAddSiteDialog', function($scope, $cookieStore, $stateParams, $modalInstance, row, doctor, toastr, TimetableModel, ConfigService){
	var user_id = $cookieStore.get('userInfo').id;

	var weeks = [
		{code: 0, value: 'Weekly'},
		{code: 1, value: 'Week 1'},
		{code: 2, value: 'Week 2'},
		{code: 3, value: 'Week 3'},
		{code: 4, value: 'Week 4'}
	];

	var save = function(){
		ConfigService.beforeSave($scope.site.errors);
		var postData = angular.copy($scope.site.form);

		postData.Creation_date = postData.Last_update_date = moment().format('YYYY-MM-DD');
		postData.Created_by = postData.Last_updated_by = user_id;
		postData.isenable = 1;
		postData.doctor_id = $stateParams.doctorId;
		postData.cal_header_df_id = row.cal_header_df_id;

		TimetableModel.siteAdd(postData)
		.then(function(response){
			toastr.success('Added Successfully');
			$modalInstance.close('add');
		}, function(error){
			$scope.site.errors = angular.copy(error.data.errors);
			ConfigService.beforeError($scope.site.errors);
		})
	}

	$scope.site = {
		options: {
			weeks: weeks,
			sites: []
		},
		form: {
			cal_header_df_id: null,
			week_ord_of_month: null,
			site_id: null,
			description: ''
		},
		errors: [],
		save: function(){
			save();
		}
	}//end site

	var loadOptions = function(){
		TimetableModel.redimedsiteList({CLINICAL_DEPT_ID: doctor.CLINICAL_DEPT_ID})
		.then(function(response){
			$scope.site.options.sites = response.data;
		}, function(error){})
	}

	loadOptions();
})