angular.module("app.loggedIn.doctor.paperless.controller", [])

.controller("DoctorPaperlessController", function($scope, PatientService, $stateParams, localStorageService){
	$scope.current_patient = {};

	// Init Object
	var initObject = function(){
		PatientService.mdtById($stateParams.patient_id).then(function(response){	
			$scope.current_patient = response.data;

			for(var key in $scope.current_patient){
				if($scope.current_patient[key]){
					if(key.indexOf("is") != -1 || key.indexOf("Is") != -1)
						$scope.current_patient[key] = $scope.current_patient[key].toString();
					if(key.indexOf("_date") != -1 || key.indexOf("DOB") != -1 || key.indexOf("Exp") != -1)
						$scope.current_patient[key] = new Date($scope.current_patient[key]);
				}
			}

			localStorageService.set('tempPatient', $scope.current_patient);
		})
	}

	initObject();
	// End Init Object
})