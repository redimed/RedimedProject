angular.module("app.loggedIn.patient.detail.controller", [])

.controller("PatientDetailController", function($scope, $state, $stateParams, PatientService, FileUploader){
	//init
	$scope.current_patient = {};
		
	

	//PARAMS
	$scope.params = {
		permission: {
			create: false,
			edit: true
		},
		id: $stateParams.patient_id,
	}
	//END PARAMS

	// Init Object
	var initObject = function(){
		PatientService.mdtById($stateParams.patient_id).then(function(response){	
			$scope.current_patient = response.data;
			console.log($scope.current_patient);

			for(var key in $scope.current_patient){
				if($scope.current_patient[key]){
					if(key.indexOf("is") != -1 || key.indexOf("Is") != -1)
						$scope.current_patient[key] = $scope.current_patient[key].toString();
					if(key.indexOf("_date") != -1 || key.indexOf("DOB") != -1 || key.indexOf("Exp") != -1)
						$scope.current_patient[key] = new Date($scope.current_patient[key]);
				}
			}
		})
	}

	initObject();
	// End Init Object
	//end init
})