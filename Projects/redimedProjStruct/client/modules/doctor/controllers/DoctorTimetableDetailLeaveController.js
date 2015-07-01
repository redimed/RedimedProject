angular.module("app.loggedIn.doctor")

.controller("DoctorTimetableDetailLeaveController", function($scope, $state, $stateParams, DoctorService, ConfigService, mdtDoctorService, mdtTimetableService, sysServiceService, REAL_DAY_OF_WEEK, toastr,$modal){
	$scope.list_day_of_week = [
		{value: 'Monday'},
		{value: 'Tuesday'},
		{value: 'Wednesday'},
		{value: 'Thursday'},
		{value: 'Friday'},
		{value: 'Saturday'}
	];
	var submitLeave = function() {
		//Tan modify
		ConfigService.beforeSave($scope.leave.errors);
		var postData = angular.copy($scope.leave.form);
		postData.from_date = ConfigService.convertToDB(postData.from_date);
		postData.to_date = ConfigService.convertToDB(postData.to_date);
		postData.doctor_id = $stateParams.doctorId;

		var modalInstance = $modal.open({
			templateUrl: 'notifyToLeaveCalendar',
			controller: function($scope, postData, $modalInstance){
				$scope.fromDateDisplay=moment(postData.from_date,"YYYY-MM-DD").format("DD/MM/YYYY");
				$scope.toDateDisplay=moment(postData.to_date,"YYYY-MM-DD").format("DD/MM/YYYY");
				//Lay danh sach cac calendar da duoc booking
				DoctorService.beforeLeaveCal(postData)
				.then(function(data){
					if(data.status=='success'){
						$scope.bookedList=data.data;
					}
					else
					{
						toastr.error('Fail.');
					}
				},function(err){
					toastr.error('Fail.');
				});

				$scope.ok = function(){
					$modalInstance.close(postData);
				}

				$scope.cancel = function(){
					$modalInstance.dismiss('cancel');
				}
			},
			// size: 'sm',
			resolve: {
				postData: function(){
					return postData;
				}
			}
		});

		modalInstance.result.then(function(postData){
			if(postData){
				DoctorService.leaveCal(postData)
				.then(function(response)
				{
					if(response.status=='success')
					{
						toastr.success('Success.');
					}
					else
					{
						toastr.error('Fail.');
					}
				}, function(error){
					toastr.error('Fail.');
					$scope.leave.errors = error.data.errors;
					ConfigService.beforeError($scope.leave.errors);
				})
			}
		})
		
	}

	$scope.leave = {
		form: {
			from_date: null,
			to_date: null,
			doctor_id:''
		},
		errors: [],
		submitLeave: function(){submitLeave(); }
	}//end leave 
})