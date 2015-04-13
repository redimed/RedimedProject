angular.module('app.loggedIn.company.dialog.addParent', [])

.controller('CompanyAddParentDialgosController', function($scope, CompanyModel,$modalInstance, companyId){
	
	$scope.companyId = companyId;

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