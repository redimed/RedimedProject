angular.module('app.loggedIn.company')
.controller('CompanyAddController', function($scope, $state,$modalInstance){
	$scope.actionCenter={
		closeModal:function(){
			$modalInstance.dismiss('cancel');
		}
	}

})