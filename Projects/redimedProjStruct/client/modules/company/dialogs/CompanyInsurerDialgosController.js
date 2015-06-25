angular.module('app.loggedIn.company')

.controller('CompanyInsurerDialgosController', function($scope, CompanyModel,$modalInstance,insurerArray){
	$scope.insurerArray = insurerArray;
	$scope.responsedata = null;
	$scope.$watch('responsedata', function(success){
		if(success){
			$modalInstance.close($scope.responsedata);
		}
	})
	$scope.clickRow = function(row){
		 $modalInstance.close(row);
	}
	$scope.ok = function () {
	    $modalInstance.close();
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
})