angular.module("app.loggedIn.patient.consult.consulthistoryController", [])
.controller("ConsultHistoryController", function($scope, ConsultationService, consult_id, $modalInstance){
	// $scope.consultion = {
	// 	consults: consults
	// }
	//phanquocchien edit
	// $scope.listConsult = consults;
	// console.log(consults);
	$scope.setListConsultHistory = function(){
		ConsultationService.getByIdConsult(consult_id).then(function(response){
			if (response.status == 'success') {
				$scope.listConsult = response.data;
				console.log($scope.listConsult);
				//set list drawing img
				ConsultationService.getImgDrawingHistory(response.data.patient_id,response.data.cal_id).then(function(data){
					if (data.status == 'success') {
						$scope.listImgDrawingHistory = data.data;
						console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',$scope.listImgDrawingHistory);
					};
				})
				ConsultationService.getDocumentFileOfPatientidAndCalid(response.data.patient_id,response.data.cal_id).then(function(data){
					if (data.status == 'success') {
						$scope.listDocumentFile = data.data;
						console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',$scope.listDocumentFile);
					};
				})
			};
		});
	}
	$scope.setListConsultHistory();
	//closr popup
	$scope.cancelDetail = function(){
		$modalInstance.close({'type':'cancel'});
	}

})