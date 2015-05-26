angular.module('app.loggedIn.claim.controllers.patientList', [])

.controller('ClaimPatientListController', function($scope, $modal, $stateParams, toastr){
	var add = function(){
		$modal.open({
			templateUrl: 'dialogClaimAdd',
			controller: 'ClaimPatientAddDialog',
			size: 'md',
			resolve: {
				patientId: function(){
					return $stateParams.patient_id;
				},
				calId: function(){
					return $stateParams.cal_id;;
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
		Patient_id: $stateParams.patient_id,
		CAL_ID: $stateParams.cal_id
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