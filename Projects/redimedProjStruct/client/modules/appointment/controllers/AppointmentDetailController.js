angular.module('app.loggedIn.appointment.controllers.detail', [])

.controller('AppointmentDetailController', function($scope, $state, $stateParams, PatientModel){
	var load = function(){
		PatientModel.byid({Patient_id: $stateParams.patientId})
		.then(function(response){
			$scope.patient.item = response.data;
		}, function(error){})
	}

	$scope.patient = {
		load: function(){ load(); },
		item: null
	}

	$scope.patient.load();

})