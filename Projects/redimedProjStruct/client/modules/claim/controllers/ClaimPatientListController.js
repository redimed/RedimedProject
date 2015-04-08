angular.module('app.loggedIn.claim.controllers.patientList', [])

.controller('ClaimPatientListController', function($scope, $modal, $stateParams, toastr){
	var add = function(){
		$modal.open({
			templateUrl: 'dialogClaimAdd',
			controller: 'ClaimPatientAddDialog',
			size: 'lg',
			resolve: {
				patientId: function(){
					return $stateParams.patientId;
				},
				calId: function(){
					return $stateParams.calId;
				}
			}
		})
		.result.then(function(response){
			if(response === 'success'){
				toastr.success('Added Successfully');
				$scope.claim.reload = true;
			}
		})
	}

	$scope.claim = {
		dialog: {
			add: function(){ 
				add(); 
				$scope.claim.reload = false;
			}
		},
		reload: false,
		limit: 20,
		Patient_id: $stateParams.patientId,
		CAL_ID: $stateParams.calId
	}//end claim
})

.controller('ClaimPatientAddDialog', function($scope, $modalInstance, patientId, calId){
	$scope.patientId = patientId;
	$scope.calId = calId;

	$scope.success = false;

	$scope.$watch('success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
})