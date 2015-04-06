angular.module('app.loggedIn.alert.controllers.patientList', [])

.controller('AlertPatientSelectDialog', function($scope, $modalInstance, Patient_id){
	$scope.alert = {
		success: false,
		Patient_id: Patient_id,
		limit: 10
	}

	$scope.$watch('alert.success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
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
					return $stateParams.patientId;
				}
			}
		})
		.result.then(function(response){
			if(response === 'success'){
				toastr.success('Added Successfully');
				$scope.alert.reload = true;
			}
		})
	}

	$scope.alert = {
		dialog: {
			select: function(){ select(); }
		},
		reload: false,
		Patient_id: $stateParams.patientId,
		limit: 20
	}
})