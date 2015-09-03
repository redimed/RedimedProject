angular.module('app.loggedIn.alert.controllers.patientList', [])

.controller('AlertPatientSelectDialog', function($scope, $modalInstance, Patient_id, CAL_ID, AlertModel, toastr){

	// Create new data when checked
	var onSaveCheck = function(data){

		var postData = angular.copy(data);

		AlertModel.insertalert(postData)
		.then(function(response){
			toastr.success('Select Successfully');
			$modalInstance.close('success');
		}, function(error){})

	}

	$scope.alert = {
		success: false
	}
    
	$scope.$watch('alert.success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})

	$scope.alert = {
		Patient_id: Patient_id,
		CAL_ID: CAL_ID,
		limit: 10,
		onSaveCheck: function(data){ onSaveCheck(data); }
	}
})

.controller('AlertPatientListController', function($scope, $modal, $stateParams, toastr){
	
	// Dialog show list
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

	// Dialog add manual alert
	var add = function() {

		$scope.alert.reload = false;
		
		$modal.open({
			templateUrl: 'dialogAddAlert',
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
			select: function(){ select(); },
			add: function(){ add(); }
		},
		reload: false,
		Patient_id: $stateParams.patient_id,
		CAL_ID: $stateParams.cal_id,
		limit: 20
	}
})