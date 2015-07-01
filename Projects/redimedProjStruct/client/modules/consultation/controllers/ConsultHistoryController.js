angular.module("app.loggedIn.patient.consult")
.controller("ConsultHistoryController", function($scope, $state, ConsultationService, consults, $modalInstance){
	$scope.consultion = {
		consults: consults
	}
	//phanquocchien edit
	$scope.listConsult = consults;
	// console.log(consults);
	// $scope.setListConsultHistory = function(){
	// 	ConsultationService.getByIdConsult(consults.consult_id).then(function(response){
	// 		$scope.listConsult = response.data;
	// 	});
	// }
	// $scope.setListConsultHistory();

	$scope.cancelDetail = function(){
		$modalInstance.close({'type':'cancel'});
	}

})