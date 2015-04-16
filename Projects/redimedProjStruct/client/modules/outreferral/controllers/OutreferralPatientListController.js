angular.module('app.loggedIn.outreferral.controllers.patientList', [])

.controller('OutreferralPatientListController', function($scope, $modal, $stateParams, toastr){
	var add = function(){
		$modal.open({
			templateUrl: 'dialogOutreferralAdd',
			controller: 'OutreferralPatientAddDialog',
			size: 'lg',
			resolve: {
				patientId: function(){
					return $stateParams.patientId;
				},
			}
		})
		.result.then(function(response){
			if(response === 'success'){
				toastr.success('Added Successfully');
				$scope.outreferral.reload = true;
			}
		})
	}

	$scope.outreferral = {
		dialog: {
			add: function(){ 
				add(); 
				$scope.outreferral.reload = false;
			}
		},
		reload: false,
		limit: 20,
		Patient_id: $stateParams.patientId,
	}//end claim
})

.controller('OutreferralPatientAddDialog', function($scope, $modalInstance, $stateParams, patientId){
	$scope.patientId = patientId;
	$scope.calId = $stateParams.calId;

	$scope.success = false;

	$scope.$watch('success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
})