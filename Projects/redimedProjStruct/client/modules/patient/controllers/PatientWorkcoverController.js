angular.module("app.loggedIn.patient.workcover.controller", [
])
.controller("PatientWorkcoverController", function ($scope,  $state, $stateParams, localStorageService, PatientService) {
	localStorageService.set('patientTempInfo', {Patient_id:  $stateParams.patient_id }); 
	localStorageService.set('apptTempInfo', {CAL_ID:  $stateParams.cal_id }); 

	var patient_id = $stateParams.patient_id ;
	var cal_id = $stateParams.cal_id;
	
	

	// PatientService.workcoverSearch(patient_id).then(function(response){
	// 	console.log(response);
	// 	$scope.groups = response.list; 
	// })

	$scope.navigator = {
		add_first: function(){
	 	  	$state.go('loggedIn.waworkcover.first', {
				patient_id: patient_id,
                action: 'add',
                cal_id: cal_id,
                wc_id: 0
            });
		},
		add_progress: function(){
			$state.go('loggedIn.waworkcover.progress', {
				patient_id: patient_id,
                action: 'add',
                cal_id: cal_id,
                wc_id: 0
            });
		},
		add_final: function(){
			$state.go('loggedIn.waworkcover.final', {
				patient_id: patient_id,
                action: 'add',
                cal_id: cal_id,
                ass_id: 0
            });
		},
        add_general: function(){
			$state.go('loggedIn.waworkcover.general', {
				patient_id: patient_id,
                action: 'add',
                cal_id: cal_id,
                ass_id: 0
            });
		},
	}

	
	$scope.first_opt = PatientService.workcoverSearchOpt('first', patient_id);
	$scope.progress_opt = PatientService.workcoverSearchOpt('progress', patient_id);
	$scope.final_opt = PatientService.workcoverSearchOpt('final', patient_id);
    $scope.general_opt = PatientService.workcoverSearchOpt('general', patient_id);
});