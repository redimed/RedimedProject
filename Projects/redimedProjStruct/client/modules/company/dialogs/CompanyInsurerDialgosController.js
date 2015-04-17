angular.module('app.loggedIn.company.dialog.addInusrer', [])

.controller('CompanyInsurerDialgosController', function($scope, CompanyModel,$modalInstance,insurerArray){
	$scope.insurerArray = insurerArray;
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