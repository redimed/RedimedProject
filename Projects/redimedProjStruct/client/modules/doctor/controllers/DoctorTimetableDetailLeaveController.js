angular.module("app.loggedIn.doctor.timetable.detail.leave.controller",[])

.controller("DoctorTimetableDetailLeaveController", function($scope, $state, $stateParams, DoctorService, ConfigService, mdtDoctorService, mdtTimetableService, sysServiceService, REAL_DAY_OF_WEEK, toastr){
	
	var submitLeave = function() {
		ConfigService.beforeSave($scope.leave.errors);
		var postData = angular.copy($scope.leave.form);
		postData.from_date = ConfigService.convertToDB(postData.from_date);
		postData.to_date = ConfigService.convertToDB(postData.to_date);
		postData.doctor_id = $stateParams.doctorId;
		DoctorService.leaveCal(postData)
					.then(function(response){
		  				toastr.success('Successfully');
		  			}, function(error){
		  				toastr.success('errors');
		  				$scope.leave.errors = error.data.errors;
		  				ConfigService.beforeError($scope.leave.errors);
		  			})
	}

	$scope.leave = {
		form: {
			FROM_TIME: '',
			TO_TIME: '',
			doctor_id:''
		},
		errors: [],
		submitLeave: function(){submitLeave(); }
	}//end leave 
})