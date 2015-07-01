angular.module("app.loggedIn.doctor")

.controller("DoctorPaperlessController", function($scope, $state, $modal, DocumentService, PatientService, $stateParams, localStorageService){
	var patient_id = $scope.patient_id = $stateParams.patient_id;
	var cal_id = $scope.cal_id = $stateParams.cal_id;

	PatientService.get(patient_id).then(function(response){
		if(response.data) 
			localStorageService.set('tempPatient', response.data)
	})
	// 


	$scope.navigator.add_general = function(){
		var params = {patient_id: patient_id, cal_id: cal_id};
		var str_state = 'loggedIn.' + $scope.tab
		$state.go(str_state, params);
	}

	$scope.faNewClick = function(){
		var modalInstance = $modal.open({
			animation:true,
			templateUrl:'modules/doctor/views/fachooseModal.html',
			controller:'FaChooseController'
		})	
	}

	$scope.OptionGorgonMA = DocumentService.optionGorgonMA(patient_id);

	$scope.OptionGorgonFA = DocumentService.optionGorgonFA(patient_id);

	$scope.OptionGorgonUQ = DocumentService.optionGorgonUQ(patient_id);

	$scope.OptionGorgonMH = DocumentService.optionGorgonMH(patient_id);

	$scope.OptionMRS = DocumentService.optionMRS(patient_id);
	
	$scope.OptionFA = DocumentService.OptionFA(patient_id);
	
	$scope.OptionMA = DocumentService.OptionMA(patient_id);
	
	$scope.OptionCategory2 = DocumentService.optionCategory2(patient_id);
	
	$scope.OptionCategory3 = DocumentService.optionCategory3(patient_id);
	
	$scope.OptionIDS = DocumentService.OptionIDS(patient_id);
	
	$scope.Optionform18 = DocumentService.Optionform18(patient_id);
	
	$scope.OptionSA1 = DocumentService.OptionSA1(patient_id);
	
	$scope.OptionSA2 = DocumentService.OptionSA2(patient_id);
	
	$scope.OptionMH = DocumentService.OptionMH(patient_id);
	
	$scope.OptionCOE = DocumentService.OptionCOE(patient_id);

})