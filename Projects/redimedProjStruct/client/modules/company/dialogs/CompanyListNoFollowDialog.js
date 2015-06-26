angular.module('app.loggedIn.company')

.controller('CompanyListNoFollowDialog', function($scope, CompanyModel,$modalInstance ,listId){
	$scope.listId = listId;
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