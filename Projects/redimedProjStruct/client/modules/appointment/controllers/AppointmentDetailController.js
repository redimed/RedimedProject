/*Controller appointment detail*/
angular.module('app.loggedIn.appointment.controllers.detail', [])

.controller('AppointmentDetailController', function($scope, $state, $stateParams, PatientModel){
	/*get patient detail by patient id*/
	var load = function(){
		PatientModel.byid({Patient_id: $stateParams.patientId})
		.then(function(response){
			$scope.patient.item = response.data;
		}, function(error){})
	}
	/*show load detail information of patient*/
	$scope.patient = {
		load: function(){ load(); },
		item: null
	}

	$scope.patient.load();

})