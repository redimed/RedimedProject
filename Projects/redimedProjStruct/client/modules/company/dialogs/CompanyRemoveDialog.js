angular.module('app.loggedIn.company.dialog.remove', [])
.controller('CompanyRemoveDialog', function($scope, $modalInstance, row){
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
	$scope.ok = function(){
		$modalInstance.close(row);
	}
})
