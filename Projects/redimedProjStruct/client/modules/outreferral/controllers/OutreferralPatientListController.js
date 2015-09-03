angular.module('app.loggedIn.outreferral.controllers.patientList', [])

.controller('OutreferralPatientListController', function($scope, $modal, $stateParams, toastr){
	var add = function(){
		$modal.open({
			templateUrl: 'dialogOutreferralAdd',
			controller: 'OutreferralPatientAddDialog',
			size: 'lg',
			resolve: {
				patientId: function(){
					// return $stateParams.patientId;//manh comment
					return $stateParams.patient_id;//manh add

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
		Patient_id: $stateParams.patient_id,
	}//end claim
})

.controller('OutreferralPatientAddDialog', function($scope, $modalInstance, $stateParams, patientId, AppointmentModel){
	$scope.patientId = patientId;
	$scope.calId = $stateParams.cal_id;

	$scope.success = false;

	AppointmentModel.one({CAL_ID: $scope.calId})
	.then(function(response){
		$scope.doctorId = response.data.DOCTOR_ID;
	})

	$scope.$watch('success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
})