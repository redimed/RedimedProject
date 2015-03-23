angular.module("app.loggedIn.consult.measurement.controller",[])
	.controller("MeasurementController",function($scope,$filter,$state,$modal,toastr,$modalInstance,$stateParams){
		$scope.cancelClick = function(){
			$modalInstance.close();
		}
		
		$scope.today = $filter('date')(new Date(),'dd/MM/yyyy');
	})