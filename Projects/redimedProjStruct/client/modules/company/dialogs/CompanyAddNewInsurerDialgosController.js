angular.module('app.loggedIn.company')

.controller('CompanyAddNewInsurerDialgosController', function($scope, CompanyModel,$modalInstance){
	$scope.responsedata = null;
	$scope.success = false;
	$scope.$watch('success', function(success){
		if(success){
			$scope.$watch('responsedata', function(success){
					$modalInstance.close($scope.responsedata);
			})
		}	
	})
	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
})