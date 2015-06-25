angular.module('app.loggedIn.alert')

.controller('AlertPatientSelectDialog', function($scope, $modalInstance, Patient_id, CAL_ID, AlertModel, toastr){
	var onSaveCheck = function(data){
		var postData = angular.copy(data);

		AlertModel.select(postData)
		.then(function(response){
			toastr.success('Select Successfully');
			$modalInstance.close('success');
		}, function(error){})
	}
	
	$scope.alert = {
		Patient_id: Patient_id,
		CAL_ID: CAL_ID,
		limit: 10,
		onSaveCheck: function(data){ onSaveCheck(data); }
	}
})

.controller('AlertPatientListController', function($scope, $modal, $stateParams, toastr){
	var select = function(){
		$scope.alert.reload = false;

		$modal.open({
			templateUrl: 'dialogAlertPatientSelect',
			controller: 'AlertPatientSelectDialog',
			size: 'lg',
			resolve: {
				Patient_id: function(){
					return $stateParams.patient_id;
				},
				CAL_ID: function(){
					return $stateParams.cal_id;
				}
			}
		})
		.result.then(function(response){
			if(response === 'success'){
				$scope.alert.reload = true;
			}
		})
	}

	$scope.alert = {
		dialog: {
			select: function(){ select(); }
		},
		reload: false,
		Patient_id: $stateParams.patient_id,
		CAL_ID: $stateParams.cal_id,
		limit: 20
	}
})