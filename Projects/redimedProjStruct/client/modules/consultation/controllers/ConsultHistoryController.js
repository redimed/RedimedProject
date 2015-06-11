angular.module("app.loggedIn.patient.consult.consulthistoryController", [])
.controller("ConsultHistoryController", function($scope, $state, ConsultationService, consults, $modalInstance){
	$scope.consultion = {
		consults: consults
	}
	//console.log('%%%%%%%%: ', consults.consult_id);
	$scope.setListConsultHistory = function(){
	 	//console.log('------', consults.consult_id);
		ConsultationService.getByIdConsult(consults.consult_id).then(function(response){
			$scope.listConsult = response.data;
			//console.log('+++++++', response.data);
		});
	}
	$scope.setListConsultHistory();

	$scope.cancelDetail = function(){
		$modalInstance.close({'type':'cancel'});
	}

})